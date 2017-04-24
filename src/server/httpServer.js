// @flow

import path                 from 'path';
import http                 from 'http';
import Promise              from 'bluebird';
import { cloneDeep }        from 'lodash';
import { mainStory, chalk, addListener } from 'storyboard';
import wsServerListener     from 'storyboard-listener-ws-server';
import express              from 'express';
import graphqlHttp          from 'express-graphql';
import ejs                  from 'ejs';
import cookieParser         from 'cookie-parser';
import compression          from 'compression';
import addAllLocales, { getReactIntlMessages } from '../locales/all';
import _t                   from '../translate';
import * as gqlServer       from './gqlServer';

let ssr = null;
try {
  /* eslint-disable import/no-unresolved */
  ssr = require('../../public/ssr/ssr.bundle');
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

const ASSET_PATH = '../../public';
const DEFAULT_BOOTSTRAP = {
  ssrHtml: '',
  ssrCss: '',
  ssrData: '',
  fnLocales: '',
  jsonData: {},
};
const COOKIE_NAMESPACE = 'mady';

addAllLocales();

function sendIndexHtml(req, res) {
  mainStory.info('http', 'Preparing index.html...');
  const userLang = req.query.lang || req.cookies[`${COOKIE_NAMESPACE}_lang`] || 'en';
  const bootstrap = cloneDeep(DEFAULT_BOOTSTRAP);
  return Promise.resolve()

    // Locales
    .then(() => {
      mainStory.debug('http', `Getting locale code for lang ${chalk.cyan.bold(userLang)}...`);
      const { lang, result } = _t.getLocaleCode(userLang);
      bootstrap.fnLocales = result;
      bootstrap.jsonData.lang = lang;
      bootstrap.jsonData.reactIntlMessages = getReactIntlMessages(lang);
      if (lang && lang !== userLang) {
        mainStory.info('http',
          `Serving locales for ${chalk.cyan.bold(lang)} instead of ${chalk.cyan.bold(userLang)}`);
      }
    })

    // SSR
    .then(() => {
      if (!ssr) return null;
      mainStory.debug('http', 'Rendering...');
      return ssr.render(req, {
        lang: bootstrap.jsonData.lang,
        reactIntlMessages: bootstrap.jsonData.reactIntlMessages,
        fnLocales: bootstrap.fnLocales,
      })
      .then((results) => {
        mainStory.debug('http', 'Finished rendering');
        const { ssrHtml, ssrCss, relayData } = results;
        bootstrap.ssrHtml = ssrHtml;
        bootstrap.ssrCss = ssrCss;
        bootstrap.jsonData.relayData = relayData;
      })
      .catch((err) => mainStory.error('http', 'Error rendering', { attach: err }));
    })

    .catch((err) => mainStory.error('http', 'Error preparing bootstrap', { attach: err }))

    // Render the result!
    .finally(() => {
      bootstrap.jsonData = JSON.stringify(bootstrap.jsonData);
      res.render('index.html', bootstrap);
      return;
    });
}

function init(options: {|
  port: number,
|}): void {
  ssr && ssr.init({ gqlServer, mainStory });

  // Disable flow on Express
  const expressApp: any = express();

  // Templating and other middleware
  expressApp.engine('html', ejs.renderFile);
  expressApp.set('views', path.join(__dirname, ASSET_PATH));
  expressApp.use(compression());
  expressApp.use(cookieParser());

  // GraphQL + GraphiQL
  expressApp.use('/graphql', graphqlHttp({
    schema: gqlServer.getSchema(),
    graphiql: true,
  }));

  // Index
  expressApp.use('/', (req, res, next) => {
    if (req.path === '/') {
      sendIndexHtml(req, res);
    } else {
      next();
    }
  });

  // Static assets
  expressApp.use(express.static(path.join(__dirname, ASSET_PATH)));

  // Create HTTP server
  const httpServer = http.createServer(expressApp);

  // Storyboard
  addListener(wsServerListener, { httpServer });

  // Look for a suitable port and start listening
  let port = options.port;
  httpServer.on('error', () => {
    mainStory.warn('http', `Port ${port} busy`);
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

// ==============================================
// Public API
// ==============================================
// eslint-disable-next-line import/prefer-default-export
export { init };
