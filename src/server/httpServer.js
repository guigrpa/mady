// @flow

import path                 from 'path';
import http                 from 'http';
import { mainStory, chalk } from 'storyboard-core';
import express              from 'express';
import graphqlHttp          from 'express-graphql';
import webpack              from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig        from './webpackConfig';

export function init(options: Object) {
  const expressApp = express();

  /*
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
  */

  /*
  expressApp.use('/graphql', graphqlHttp({
    schema: {},
    graphiql: true,
  }));
  */

  /*
  expressApp.use('/', (req, res, next) => {
    if (req.path === '/') {
      next();
    } else {
      res.send('index.html');
    }
  });
  */

  const httpServer = http.createServer(expressApp);
  let port = options.port;

  httpServer.on('error', () => {
    if (port >= options.port + 20) {
      mainStory.error('http', 'Cannot open port (tried 20 times)');
      return;
    }
    mainStory.warn('http', `Port ${port} busy`);
    port++;
    httpServer.listen(port);
  });
  httpServer.on('listening', () => {
    mainStory.info('http', `Listening on port ${chalk.cyan.bold(port)}`);
  });
  httpServer.listen(port);
}
