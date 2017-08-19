/* eslint-disable no-console */

const path = require('path');
const webpack = require('webpack'); // eslint-disable-line
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = (env = {}) => {
  const fProduction = env.NODE_ENV === 'production';
  const fSsr = !!env.SERVER_SIDE_RENDERING;
  const fAnalyze = !!env.ANALYZE_BUNDLE;

  console.log(`Compiling for production: ${fProduction}`);
  console.log(`Compiling for SSR: ${fSsr}`);
  console.log(`Bundle analyser: ${fAnalyze}`);

  const cssLoader = {
    loader: 'css-loader',
    options: { minimize: fProduction },
  };

  const sassLoader = {
    loader: 'sass-loader',
    options: { indentedSyntax: true },
  };

  const styleRules = loaders =>
    fSsr
      ? ExtractTextPlugin.extract({
          fallback: 'style-loader',
          use: loaders,
        })
      : [{ loader: 'style-loader' }].concat(loaders);

  return {
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
      path: fSsr
        ? path.resolve(process.cwd(), 'lib/public/ssr')
        : path.resolve(process.cwd(), 'lib/public/assets'),
      publicPath: '/assets/',
      libraryTarget: fSsr ? 'umd' : undefined,
    },

    // -------------------------------------------------
    // Configuration
    // -------------------------------------------------
    devtool: fProduction || fSsr ? undefined : 'eval',
    target: fSsr ? 'node' : undefined,

    // Don't redefine `__dirname` when compiling for Node (SSR)
    // https://github.com/webpack/webpack/issues/1599#issuecomment-186841345
    node: fSsr ? { __dirname: false, __filename: false } : undefined,

    plugins: (() => {
      const out = [
        new webpack.DefinePlugin({
          'process.env.SERVER_SIDE_RENDERING': JSON.stringify(fSsr),
        }),
      ];
      if (fSsr) {
        out.push(new ExtractTextPlugin('[name].bundle.css'));
      }
      if (fAnalyze) {
        out.push(new BundleAnalyzerPlugin());
      }
      return out;
    })(),

    module: {
      rules: (() => {
        let out = [];
        if (fSsr) {
          out.push({
            test: /\.js$/,
            include: [path.resolve('node_modules/socket.io-client')],
            use: 'null-loader',
          });
        }
        out = out.concat([
          {
            test: /\.(js|jsx)$/,
            loader: 'babel-loader',
            exclude: [/node_modules/],
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
        ]);
        return out;
      })(),
    },
  };
};
