const getBabelRelayPlugin = require('babel-relay-plugin');
const schema = require('../common/gqlSchema.json');
module.exports = getBabelRelayPlugin(schema.data);
