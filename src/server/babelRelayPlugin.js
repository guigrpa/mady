const storyboard = require('storyboard');
try {
  var getBabelRelayPlugin = require('babel-relay-plugin');
  var schema = require('../common/gqlSchema.json');
  module.exports = getBabelRelayPlugin(schema.data);
} catch (err) {
  storyboard.mainStory.warn('babelRelayPlugin', 'Could not load babel-relay-plugin');
}
