// @flow

/* eslint-disable global-require, import/prefer-default-export */

import path from 'path';
import fs from 'fs';
import http from 'http';
import cloneDeep from 'lodash/cloneDeep';
import { mainStory, chalk } from 'storyboard';
import express from 'express';
import graphqlHttp from 'express-graphql';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import addAllLocales, { getReactIntlMessages } from './allLocales';
import _t from '../translate';
import * as gqlServer from './graphql/gqlServer';
import * as db from './db';

let ssr = null;
try {
  /* eslint-disable import/no-unresolved */
  // $FlowFixMe: SSR is not yet flow-covered
  ssr = require('../public/ssr/ssr.bundle');
  /* eslint-disable import/no-unresolved */
  mainStory.info('http', 'Loaded SSR module successfully');
} catch (err) {
  if (err.message.indexOf('Cannot find module') !== 0) {
    mainStory.warn('http', 'SSR module could not be loaded', { attach: err });
  } else {
    mainStory.warn('http', 'No SSR module available');
  }
}
/* eslint-enable global-require */

const ASSET_PATH = '../public';
const ABS_ASSET_PATH = path.join(__dirname, ASSET_PATH);
const MADY_HTML = fs.readFileSync(
  path.join(ABS_ASSET_PATH, 'mady.html'),
  'utf8'
);
const DEFAULT_BOOTSTRAP = {
  ssrHtml: '',
  ssrCss: '',
  ssrData: '',
  fnLocales: '',
  jsonData: {},
};
const COOKIE_NAMESPACE = 'mady';

addAllLocales();

// ==============================================
// Main
// ==============================================
type Options = {|
  expressApp?: Object,
  httpServer?: Object,
  port?: number,
|};

function init(options: Options): Object {
  ssr && ssr.init({ gqlServer, mainStory });

  // Create app if needed
  const expressApp = options.expressApp || createExpressApp();

  // Add endpoints
  const schema = gqlServer.getSchema();
  expressApp.use('/mady-graphql', graphqlHttp({ schema, graphiql: true }));
  expressApp.get('/mady-autotranslate', async (req, res) => {
    const { lang, text } = req.query;
    const translation = await db.getAutoTranslation(text, lang);
    res.send(translation);
  });
  expressApp.use('/mady', sendIndexHtml);
  expressApp.use(express.static(ABS_ASSET_PATH));

  // Create HTTP server + look for a suitable port and start listening
  const httpServer = options.httpServer || http.createServer(expressApp);
  if (options.httpServer == null && options.port != null) {
    startListening(httpServer, options.port);
  }

  return httpServer;
}

// ==============================================
// Helpers
// ==============================================
const createExpressApp = () => {
  // Disable flow on Express
  const expressApp: Object = express();

  // Middleware
  expressApp.use(compression());
  expressApp.use(cookieParser());

  return expressApp;
};

const startListening = (httpServer, initialPort) => {
  let port = initialPort;
  httpServer.on('error', () => {
    mainStory.warn('http', `Port ${String(port)} busy`);
    port += 1;
    if (port >= initialPort + 20) {
      mainStory.error('http', 'Cannot open port (tried 20 times)');
      return;
    }
    httpServer.listen(port);
  });
  httpServer.on('listening', () => {
    mainStory.info('http', `Listening on port ${chalk.cyan.bold(port)}`);
  });
  httpServer.listen(port);
};

const sendIndexHtml = async (req, res) => {
  mainStory.info('http', 'Preparing mady.html...');
  const userLang =
    req.query.lang || req.cookies[`${COOKIE_NAMESPACE}_lang`] || 'en';
  const bootstrap = cloneDeep(DEFAULT_BOOTSTRAP);

  try {
    // Locales
    mainStory.debug(
      'http',
      `Getting locale code for lang ${chalk.cyan.bold(userLang)}...`
    );
    const { lang, result } = _t.getLocaleCode(userLang);
    bootstrap.fnLocales = result;
    bootstrap.jsonData.lang = lang;
    bootstrap.jsonData.reactIntlMessages = getReactIntlMessages(lang);
    if (lang && lang !== userLang) {
      mainStory.info(
        'http',
        `Serving locales for ${chalk.cyan.bold(
          lang
        )} instead of ${chalk.cyan.bold(userLang)}`
      );
    }

    // SSR
    if (ssr) {
      mainStory.debug('http', 'Rendering...');
      try {
        const results = await ssr.render(req, {
          lang: bootstrap.jsonData.lang,
          reactIntlMessages: bootstrap.jsonData.reactIntlMessages,
          fnLocales: bootstrap.fnLocales,
        });
        mainStory.debug('http', 'Finished rendering');
        const { ssrHtml, ssrCss, relayData } = results;
        bootstrap.ssrHtml = ssrHtml;
        bootstrap.ssrCss = ssrCss;
        bootstrap.jsonData.relayData = relayData;
      } catch (err2) {
        mainStory.error('http', 'Error rendering', { attach: err2 });
      }
    }
  } catch (err) {
    mainStory.error('http', 'Error preparing bootstrap', { attach: err });
  } finally {
    // Render the result!
    bootstrap.jsonData = JSON.stringify(bootstrap.jsonData);
    const out = MADY_HTML.replace('<%- ssrCss %>', bootstrap.ssrCss)
      .replace('<%- ssrHtml %>', bootstrap.ssrHtml)
      .replace('<%- jsonData %>', bootstrap.jsonData)
      .replace('<%- fnLocales %>', bootstrap.fnLocales);
    res.send(out);
  }
};

// ==============================================
// Public
// ==============================================
export { init };
