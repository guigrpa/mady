// @flow
'use strict';

const program     = require('commander');
const Promise     = require('bluebird');
Promise.longStackTraces();
const pkg         = require('../../package.json');
const files       = require('./files');

program
  .version(pkg.version)
  .option('-d, --dir [dir]', 'Relative path to locale folder')
  .parse(process.argv);

files.init();
