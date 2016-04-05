import path                 from 'path';
import http                 from 'http';
import storyboard           from 'storyboard';
const { mainStory, chalk } = storyboard;
import storyboardWsServer   from 'storyboard/lib/listeners/wsServer';
import express              from 'express';
import graphqlHttp          from 'express-graphql';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig        from './webpackConfig';
import * as gqlServer       from './gqlServer';

const ASSET_PATH = 'public';

export function init(options: Object) {
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

  // GraphQL + GraphiQL
  expressApp.use('/graphql', graphqlHttp({
    schema: gqlServer.getSchema(),
    graphiql: true,
  }));

  // DELETE
  /*
  expressApp.use('/', (req, res, next) => {
    if (req.path === '/') {
      next();
    } else {
      res.send('index.html');
    }
  });
  */

  // Static assets
  expressApp.use(express.static(path.join(process.cwd(), ASSET_PATH)));

  // Create HTTP server
  const httpServer = http.createServer(expressApp);

  // Storyboard
  storyboard.addListener(storyboardWsServer, {
    httpServer,
    authenticate: () => true,
  });

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
