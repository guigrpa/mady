// @flow
'use strict';

const fs          = require('fs-extra');
const path        = require('path');
const program     = require('commander');
const Promise     = require('bluebird');
Promise.longStackTraces();
const inquirer    = require('inquirer');
const pkg         = require('../package.json');

program
  .version(pkg.version)
  .option('-d, --dir [dir]', 'Relative path to locale folder')
  .parse(process.argv);

const rcPath = path.join(process.cwd(), '.abroadrc');

Promise.resolve()
.then(() => {
  let dir = program.dir;
  if (!dir) {
    try {
      const opts = JSON.parse(fs.readFileSync(rcPath));
      dir = opts.dir;
    } catch (err) {
      // Ignore exception
    }
  }
  if (!dir) {
    const questions = [
      {
        name: 'dir',
        message: 'Please specify a folder for your locales',
        default: './locales',
      },
    ];
    dir = new Promise((resolve) => {
      inquirer.prompt(questions, (answers) => {
        resolve(answers.dir);
      });
    });
  }
  return dir;
})
.then(dir => {
  fs.writeFileSync(rcPath, JSON.stringify({ dir }, null, '  '));
});
