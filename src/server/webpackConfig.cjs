require('babel-core/register');
const { addListener } = require('storyboard');
const consoleListener = require('storyboard-listener-console').default;
addListener(consoleListener);
module.exports = require('./webpackConfig');
