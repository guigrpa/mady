import path from 'path';
import { mainStory } from 'storyboard';
import webpack from 'webpack';
import ExtractTextPlugin from 'extract-text-webpack-plugin';
import { BundleAnalyzerPlugin } from 'webpack-bundle-analyzer';

const pkg = require('../../package.json');

const fProduction = process.env.NODE_ENV === 'production';
const fSsr = !!process.env.SERVER_SIDE_RENDERING;
const fAnalyze = !!process.env.ANALYZE_BUNDLE;

mainStory.info('webpack', 'Webpack configuration:', {
  attach: {
    environment: fProduction ? 'PRODUCTION' : 'DEVELOPMENT',
    fSsr,
    version: pkg.version,
  },
});

const cssLoader = {
  loader: 'css-loader',
  options: { minimize: fProduction },
};

const sassLoader = {
  loader: 'sass-loader',
  options: { indentedSyntax: true },
};

const styleRules = loaders => {
  if (fSsr)
    return ExtractTextPlugin.extract({
      fallbackLoader: 'style-loader',
      loader: loaders,
    });
  return [{ loader: 'style-loader' }].concat(loaders);
};

export default {
  // -------------------------------------------------
  // Input (entry point)
  // -------------------------------------------------
  entry: fSsr
    ? { ssr: ['./src/server/ssr.js'] }
    : { app: ['./src/client/startup.js'] },

  // -------------------------------------------------
  // Output
  // -------------------------------------------------
  output: {
    filename: '[name].bundle.js',

    // Where PRODUCTION bundles will be stored
    path: fSsr
      ? path.resolve(process.cwd(), 'public/ssr')
      : path.resolve(process.cwd(), 'public/assets'),

    publicPath: '/assets/',

    libraryTarget: fSsr ? 'commonjs2' : undefined,
  },

  // -------------------------------------------------
  // Configuration
  // -------------------------------------------------
  devtool: fProduction || fSsr ? undefined : 'eval',
  target: fSsr ? 'node' : undefined,

  // Don't redefine `__dirname` when compiling for Node (SSR)
  // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
  node: fSsr ? { __dirname: false, __filename: false } : undefined,

  resolve: {
    // Add automatically the following extensions to required modules
    extensions: ['.jsx', '.js'],
  },

  plugins: (() => {
    const ret = [
      function pluginCompile() {
        this.plugin('compile', () => mainStory.debug('webpack', 'Bundling...'));
      },
      function pluginDone() {
        this.plugin('done', () =>
          mainStory.debug('webpack', 'Finished bundling!')
        );
      },
      new webpack.DefinePlugin({
        'process.env.NODE_ENV': JSON.stringify(
          fProduction ? 'production' : 'development'
        ),
        'process.env.SERVER_SIDE_RENDERING': JSON.stringify(fSsr),
      }),
    ];
    if (fSsr) {
      ret.push(new ExtractTextPlugin('[name].bundle.css'));
    }
    if (fProduction) {
      ret.push(new webpack.optimize.UglifyJsPlugin());
    } else if (!fSsr) {
      ret.push(new webpack.HotModuleReplacementPlugin());
      ret.push(new webpack.NoEmitOnErrorsPlugin());
    }
    if (fAnalyze) {
      ret.push(new BundleAnalyzerPlugin());
    }
    return ret;
  })(),

  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        loader: 'babel-loader',
        exclude: path.resolve(process.cwd(), 'node_modules'),
      },
      {
        test: /\.(otf|eot|svg|ttf|woff|woff2)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
        loader: 'file-loader',
      },
      {
        test: /\.css$/,
        use: styleRules([cssLoader]),
      },
      {
        test: /\.sass$/,
        use: styleRules([cssLoader, sassLoader]),
      },
      {
        test: /\.png$/,
        loader: 'file-loader',
      },
    ],
  },
};
