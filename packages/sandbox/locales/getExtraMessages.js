const path = require('path');
const fs = require('fs-extra');

module.exports = () => fs.readJsonSync(path.join(__dirname, 'extraMessagesForScopeTest.json'));