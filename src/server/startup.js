// @flow

import { mainStory, addListener } from 'storyboard';
import consoleListener from 'storyboard-listener-console';
import program from 'commander';
import opn from 'opn';
import * as db from './db';
import * as gqlServer from './gqlServer';
import * as httpServer from './httpServer';

const pkg = require('../../package.json');

const DEFAULT_LOCALE_PATH = 'locales';
const DEFAULT_PORT = 8080;

addListener(consoleListener);
process.on('SIGINT', () => {
  mainStory.debug('startup', 'CTRL-C received');
  process.exit(0);
});

// ==============================================
// Main
// ==============================================
program
  .version(pkg.version)
  .option(
    '-d, --dir [dir]',
    'Relative path to locale folder',
    DEFAULT_LOCALE_PATH
  )
  .option(
    '-p, --port [port]',
    'Initial port number to use ' +
      '(if unavailable, the next available one will be used)',
    Number,
    DEFAULT_PORT
  )
  .option('--recompile', 'Recompile translations upon launch')
  .option('--importV0 [dir]', 'Import a "v0" (old) locale folder')
  .parse(process.argv);

const cliOptions = program.opts();

mainStory.info('startup', 'CLI options:', { attach: cliOptions });
db.init({ localeDir: cliOptions.dir, fRecompile: cliOptions.recompile });
if (cliOptions.importV0) {
  db.importV0(cliOptions.importV0);
} else {
  gqlServer.init();
  httpServer.init({ port: cliOptions.port });
}
opn(`http://localhost:${cliOptions.port}/`);
