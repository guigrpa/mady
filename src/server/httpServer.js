import path                 from 'path';
import http                 from 'http';
import Promise              from 'bluebird';
import timm                 from 'timm';
import storyboard           from 'storyboard';
const { mainStory, chalk } = storyboard;
import storyboardWsServer   from 'storyboard/lib/listeners/wsServer';
import express              from 'express';
import graphqlHttp          from 'express-graphql';
import ejs                  from 'ejs';
import cookieParser         from 'cookie-parser';
import compression          from 'compression';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig        from './webpackConfig';
import * as gqlServer       from './gqlServer';
let ssr = null;
try {
  ssr = require('../../lib/server/ssr/ssr.bundle');
  mainStory.info('http', 'Loaded SSR module successfully');
} catch (err) {
  mainStory.warn('http', 'No SSR module available');
}

const ASSET_PATH = '../../public';
const DEFAULT_BOOTSTRAP = {
  ssrHtml: '',
  ssrCss: '',
};

function sendIndexHtml(req, res) {
  mainStory.info('http', 'Sending index.html...');
  return Promise.resolve()
    .then(() => (ssr ? ssr.render(req) : {}))
    .then(bootstrap => {
      const finalBootstrap = timm.addDefaults(bootstrap, DEFAULT_BOOTSTRAP);
      res.render('index.html', finalBootstrap);
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
  storyboard.addListener(storyboardWsServer, { httpServer });

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
