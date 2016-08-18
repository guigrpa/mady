import path                 from 'path';
import http                 from 'http';
import Promise              from 'bluebird';
import { cloneDeep }        from 'lodash';
import storyboard           from 'storyboard';
const { mainStory, chalk } = storyboard;
import wsServerListener     from 'storyboard/lib/listeners/wsServer';
import express              from 'express';
import graphqlHttp          from 'express-graphql';
import ejs                  from 'ejs';
import cookieParser         from 'cookie-parser';
import compression          from 'compression';
import addAllLocales        from '../locales/all';
import _t                   from '../translate';
import * as gqlServer       from './gqlServer';
let webpack;
let webpackDevMiddleware;
let webpackHotMiddleware;
let webpackConfig;
/* eslint-disable global-require */
if (process.env.NODE_ENV !== 'production') {
  webpack              = require('webpack');
  webpackDevMiddleware = require('webpack-dev-middleware');
  webpackHotMiddleware = require('webpack-hot-middleware');
  webpackConfig        = require('./webpackConfig').default;
}
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
        fnLocales: bootstrap.fnLocales,
      })
      .then(results => {
        mainStory.debug('http', 'Finished rendering');
        const { ssrHtml, ssrCss, relayData } = results;
        bootstrap.ssrHtml = ssrHtml;
        bootstrap.ssrCss = ssrCss;
        bootstrap.jsonData.relayData = relayData;
      })
      .catch(err => mainStory.error('http', 'Error rendering', { attach: err }));
    })

    .catch(err => mainStory.error('http', 'Error preparing bootstrap', { attach: err }))

    // Render the result!
    .finally(() => {
      bootstrap.jsonData = JSON.stringify(bootstrap.jsonData);
      res.render('index.html', bootstrap);
      return;
    });
}

export function init(options: Object) {
  // TODO: webpack SSR if not pre-compiled
  ssr && ssr.init({ gqlServer, mainStory });

  const expressApp = express();

  // Webpack middleware (for development)
  if (process.env.NODE_ENV !== 'production') {
    const compiler = webpack(webpackConfig);
    expressApp.use(webpackDevMiddleware(compiler, {
      noInfo: true,
      quiet: false,
      publicPath: webpackConfig.output.publicPath,
      stats: { colors: true },
    }));
    expressApp.use(webpackHotMiddleware(compiler));
  }

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
  storyboard.addListener(wsServerListener, { httpServer });

  // Look for a suitable port and start listening
  let port = options.port;
  httpServer.on('error', () => {
    mainStory.warn('http', `Port ${port} busy`);
    port++;
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
