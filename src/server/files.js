// @flow
'use strict';

const fs          = require('fs-extra');
const path        = require('path');
const program     = require('commander');
const Promise     = require('bluebird');
const inquirer    = require('inquirer');

let _dir = null;

function init() {
  const rcPath = path.join(process.cwd(), '.abroadrc');
  return Promise.resolve()
  .then(() => {

    // Dir provided by the user
    _dir = program.dir;
    if (_dir) return null;

    // Dir provided by `.abroadrc` file
    try {
      const opts = JSON.parse(fs.readFileSync(rcPath));
      _dir = opts.dir;
      return null;
    } catch (err) { /* Ignore exception */ }

    // Ask the user
    const questions = [
      {
        name: 'dir',
        message: 'Please specify a folder for your locales',
        default: './locales',
      },
    ];
    return new Promise((resolve) => {
      inquirer.prompt(questions, (answers) => {
        resolve(answers.dir);
      });
    })
    .then(dir => { _dir = dir; });
  })

  // Persist config
  .then(() => {
    fs.writeFileSync(rcPath, JSON.stringify({ dir: _dir }, null, '  '));
  });
}

module.exports = {
  init,
};
