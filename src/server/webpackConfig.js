import path                 from 'path';
import { mainStory }        from 'storyboard';
import webpack              from 'webpack';
const pkg                   = require('../../package.json');

const fProduction = (process.env.NODE_ENV === 'production');

mainStory.info('webpack', 'Webpack configuration:');
mainStory.info('webpack', `- Environment: ${fProduction ? 'PRODUCTION' : 'DEVELOPMENT'}`);
mainStory.info('webpack', `- Version: ${pkg.version}`);
if (fProduction) mainStory.info('webpack', 'This might take a little while... :)');

const _entry = file =>
  (fProduction ? [file] : ['webpack-hot-middleware/client?reload=true', file]);

export default {

  // -------------------------------------------------
  // Input (entry point)
  // -------------------------------------------------
  entry: {
    app: _entry('./src/client/startup.js'),
  },

  // -------------------------------------------------
  // Output
  // -------------------------------------------------
  output: {
    filename: '[name].bundle.js',

    // Where PRODUCTION bundles will be stored
    path: path.resolve(process.cwd(), 'public'),

    publicPath: '/',
  },

  // -------------------------------------------------
  // Configuration
  // -------------------------------------------------
  devtool: fProduction ? undefined : 'eval',

  resolve: {
    // Add automatically the following extensions to required modules
    extensions: ['', '.jsx', '.js'],
  },

  plugins: (() => {
    let ret = [
      function pluginCompile() {
        this.plugin('compile', () => mainStory.debug('webpack', 'Bundling...'));
      },
      function pluginDone() {
        this.plugin('done', () => mainStory.debug('webpack', 'Finished bundling!'));
      },
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(fProduction ? 'production' : 'development'),
      }),
    ];
    if (fProduction) {
      ret = ret.concat([
        // Minimise
        new webpack.optimize.UglifyJsPlugin({
          compress: { warnings: false },
          sourceMap: false,
        }),
      ]);
    } else {
      ret = ret.concat([
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
      ]);
    }
    return ret;
  })(),

  module: {
    loaders: [{
      test: /\.(js|jsx)$/,
      loader: 'babel',
      exclude: path.resolve(process.cwd(), 'node_modules'),
    }, {
      test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
      loader: 'file',
    }, {
      test: /\.css$/,
      loader: 'style!css',
    }, {
      test: /\.sass$/,
      loader: 'style!css!sass?indentedSyntax',
    }, {
      test: /\.png$/,
      loader: 'file',
    }],
  },
};
