import path                 from 'path';
import { mainStory }        from 'storyboard';
import webpack              from 'webpack';
import ExtractTextPlugin    from 'extract-text-webpack-plugin';
const pkg                   = require('../../package.json');

const fProduction = (process.env.NODE_ENV === 'production');
const fSsr = (!!process.env.SERVER_SIDE_RENDERING);

mainStory.info('webpack', 'Webpack configuration:', {
  attach: {
    environment: fProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    fSsr,
    version: pkg.version,
  },
});
if (fProduction) mainStory.warn('webpack', 'This might take a little while... :)');

const _entry = file => (
  (fProduction || fSsr) ? [file]
                        : ['webpack-hot-middleware/client?reload=true', file]
);

const _styleLoader = loaderDesc => (
  fSsr ? ExtractTextPlugin.extract('style-loader', loaderDesc)
       : `style!${loaderDesc}`
);

export default {

  // -------------------------------------------------
  // Input (entry point)
  // -------------------------------------------------
  entry: fSsr ? { ssr: _entry('./src/server/ssr.js') }
              : { app: _entry('./src/client/startup.js') },

  // -------------------------------------------------
  // Output
  // -------------------------------------------------
  output: {
    filename: '[name].bundle.js',

    // Where PRODUCTION bundles will be stored
    path: fSsr ? path.resolve(process.cwd(), 'lib/server/ssr')
               : path.resolve(process.cwd(), 'public'),

    publicPath: '/',

    libraryTarget: fSsr ? 'commonjs2' : undefined,
  },

  // -------------------------------------------------
  // Configuration
  // -------------------------------------------------
  devtool: fProduction || fSsr ? undefined : 'eval',
  target: fSsr ? 'node' : undefined,

  resolve: {
    // Add automatically the following extensions to required modules
    extensions: ['', '.jsx', '.js'],
  },

  plugins: (() => {
    const ret = [
      function pluginCompile() {
        this.plugin('compile', () => mainStory.debug('webpack', 'Bundling...'));
      },
      function pluginDone() {
        this.plugin('done', () => mainStory.debug('webpack', 'Finished bundling!'));
      },
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(fProduction ? 'production' : 'development'),
        'process.env.SERVER_SIDE_RENDERING': JSON.stringify(fSsr),
      }),
    ];
    if (fSsr) {
      ret.push(new ExtractTextPlugin('[name].bundle.css'));
    }
    if (fProduction) {
      ret.push(new webpack.optimize.UglifyJsPlugin({
        compress: { warnings: false },
        sourceMap: false,
      }));
    } else if (!fSsr) {
      ret.push(new webpack.HotModuleReplacementPlugin());
      ret.push(new webpack.NoErrorsPlugin());
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
      loader: _styleLoader('css'),
    }, {
      test: /\.sass$/,
      loader: _styleLoader('css!sass?indentedSyntax'),
    }, {
      test: /\.png$/,
      loader: 'file',
    }, {
      test: /\.json$/,
      loader: 'json',
    }],
  },
};
