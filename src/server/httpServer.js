// @flow

/* eslint-disable global-require, import/prefer-default-export */

import path from 'path';
import http from 'http';
import cloneDeep from 'lodash/cloneDeep';
import { mainStory, chalk } from 'storyboard';
import express from 'express';
import graphqlHttp from 'express-graphql';
import ejs from 'ejs';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import addAllLocales, { getReactIntlMessages } from './allLocales';
import _t from '../translate';
import * as gqlServer from './graphql/gqlServer';

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
  port?: number,
|};

function init(options: Options): Object {
  ssr && ssr.init({ gqlServer, mainStory });

  const expressApp = options.expressApp || createExpressApp();

  // GraphQL + GraphiQL
  const schema = gqlServer.getSchema();
  expressApp.use('/mady-graphql', graphqlHttp({ schema, graphiql: true }));

  // Index
  expressApp.use('/mady', sendIndexHtml);

  // Static assets
  expressApp.use(express.static(path.join(__dirname, ASSET_PATH)));

  // Create HTTP server
  const httpServer = http.createServer(expressApp);

  // Look for a suitable port and start listening
  let { port } = options;
  if (port != null) {
    httpServer.on('error', () => {
      mainStory.warn('http', `Port ${String(port)} busy`);
      port += 1;
      if (port >= options.port + 20) {
        mainStory.error('http', 'Cannot open port (tried 20 times)');
        return;
      }
      httpServer.listen(port);
    });
    httpServer.on('listening', () => {
      mainStory.info('http', `Listening on port ${chalk.cyan.bold(port)}`);
    });
    httpServer.listen(port);
  }

  return httpServer;
}

// ==============================================
// Helpers
// ==============================================
const createExpressApp = () => {
  // Disable flow on Express
  const expressApp: Object = express();

  // Templating and other middleware
  expressApp.engine('html', ejs.renderFile);
  expressApp.set('views', path.join(__dirname, ASSET_PATH));
  expressApp.use(compression());
  expressApp.use(cookieParser());

  return expressApp;
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
    res.render('mady.html', bootstrap);
  }
};

// ==============================================
// Public
// ==============================================
export { init };
