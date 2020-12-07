const webpack = require('webpack'); // eslint-disable-line

const pkg = require('./package.json');

// const { BASE_URL, BACK_END_BASE_URL } = process.env;

module.exports = {
  env: {
    // BASE_URL: BASE_URL || '',
    // BACK_END_BASE_URL: BACK_END_BASE_URL || '',
    APP_VERSION: pkg.version,
  },
  basePath: '/mady',
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack: (config) => {
    config.plugins.push(new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/));
    return config;
  },
};
