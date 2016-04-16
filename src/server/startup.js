// @flow

import Promise              from 'bluebird';
Promise.longStackTraces();
import path                 from 'path';
import timm                 from 'timm';
import { mainStory }        from 'storyboard';
import fs                   from 'fs-extra';
import program              from 'commander';
import inquirer             from 'inquirer';
const pkg                   = require('../../package.json');
import * as db              from './db';
import * as gqlServer       from './gqlServer';
import * as httpServer      from './httpServer';

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
  .option('--importV0 [dir]', 'Import a "v0" (old) locale folder')
  .parse(process.argv);

Promise.resolve()
  .then(() => _readLaunchPars())
  .then(() => {
    mainStory.info('startup', 'Launch parameters:', { attach: _launchPars });
    db.init({ localeDir: _launchPars.localeDir });
  })
  .then(() => {
    if (program.importV0) {
      db.importV0(program.importV0);
    } else {
      gqlServer.init();
      httpServer.init({ port: _launchPars.port });
    }
  });


// ==============================================
// Helpers
// ==============================================
function _readLaunchPars() {
  const launchParsPath = path.join(process.cwd(), '.madyrc');
  let launchPars = {};
  let fModified = false;

  // Config provided by `.madyrc` file
  try {
    launchPars = JSON.parse(fs.readFileSync(launchParsPath));
  } catch (err) { /* Ignore exception */ }

  // Config updated by CLI arguments
  const launchPars2 = timm.merge(launchPars, {
    localeDir: program.dir,
    port: program.port,
  });
  if (launchPars2 !== launchPars) {
    fModified = true;
    launchPars = launchPars2;
  }

  // Config complemented by questions to the user
  const questions = [
    {
      name: 'localeDir',
      message: 'Please specify a folder for your locales and config',
      default: DEFAULT_LOCALE_PATH,
      when: () => (launchPars.localeDir == null),
    },
    {
      name: 'port',
      message: 'Please specify an initial port',
      default: DEFAULT_PORT,
      when: () => (launchPars.port == null),
    },
  ];
  return inquirer.prompt(questions)
    .then(answers => {
      fModified = fModified || !!Object.keys(answers).length;
      _launchPars = timm.merge(launchPars, answers);
      if (fModified) db.saveJson(launchParsPath, _launchPars);
    });
}
