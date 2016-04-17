const storyboard = require('storyboard');
try {
  const getBabelRelayPlugin = require('babel-relay-plugin');
  const schema = require('../common/gqlSchema.json');
  module.exports = getBabelRelayPlugin(schema.data);
} catch (err) {
  storyboard.mainStory.warn('babelRelayPlugin', 'Could not load babel-relay-plugin');
}
