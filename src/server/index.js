// @flow

import path                 from 'path';
import timm                 from 'timm';
import { mainStory }        from 'storyboard-core';
import fs                   from 'fs-extra';
import program              from 'commander';
import inquirer             from 'inquirer';
import Promise              from 'bluebird';
Promise.longStackTraces();
const pkg                   = require('../../../package.json');  // from lib/es5/server
import * as files           from './files';

let _launchPars = null;

const DEFAULT_LOCALE_PATH = 'locales';
const DEFAULT_PORT = 8080;

// ==============================================
// Main
// ==============================================
program
  .version(pkg.version)
  .option('-d, --dir [dir]', 'Relative path to locale folder')
  .option('-p, --port [port]', 'Initial port number to use ' +
    '(if unavailable, the next available one will be used)')
  .parse(process.argv);


_readLaunchPars()
.then(() => {
  mainStory.info('main', 'Launch parameters:', { attach: _launchPars });
  const { localeDir } = _launchPars;
  files.init({ localeDir });
});


// ==============================================
// Helpers
// ==============================================
function _readLaunchPars() {
  const configPath = path.join(process.cwd(), '.madyrc');
  let config = {};
  let fModified = false;

  // Config provided by `.madyrc` file
  try {
    config = JSON.parse(fs.readFileSync(configPath));
  } catch (err) { /* Ignore exception */ }

  // Config updated by CLI arguments
  const config2 = timm.merge(config, {
    localeDir: program.dir,
    port: program.port,
  });
  if (config2 !== config) {
    fModified = true;
    config = config2;
  }

  // Config complemented by questions to the user
  const questions = [
    {
      name: 'localeDir',
      message: 'Please specify a folder for your locales and config',
      default: DEFAULT_LOCALE_PATH,
      when: () => (config.localeDir == null),
    },
    {
      name: 'port',
      message: 'Please specify an initial port',
      default: DEFAULT_PORT,
      when: () => (config.port == null),
    },
  ];
  return new Promise((resolve) => {
    inquirer.prompt(questions, resolve);
  })
  .then(answers => {
    fModified = fModified || !!Object.keys(answers).length;
    _launchPars = timm.merge(config, answers);
    if (fModified) files.saveJson(configPath, _launchPars);
  });
}
