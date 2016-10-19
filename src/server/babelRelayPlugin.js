// @flow

/* eslint-disable global-require */
const storyboard = require('storyboard');

try {
  const getBabelRelayPlugin = require('babel-relay-plugin');
  const schema = require('../common/gqlSchema.json');

  module.exports = getBabelRelayPlugin(schema.data);
} catch (err) {
  // istanbul ignore next
  storyboard.mainStory.warn('babelRelayPlugin', 'Could not load babel-relay-plugin');
}
/* eslint-enable global-require */
