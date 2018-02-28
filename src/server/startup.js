// @flow

import { mainStory, addListener } from 'storyboard';
import consoleListener from 'storyboard-listener-console';
import wsServerListener from 'storyboard-listener-ws-server';
import program from 'commander';
import opn from 'opn';
import * as db from './db';
import { init as gqlInit } from './graphql/gqlServer';
import { init as httpInit } from './httpServer';
import { init as socketInit } from './socketServer';

const pkg = require('../../package.json');

const DEFAULT_LOCALE_PATH = 'locales';
const DEFAULT_PORT = 8080;

addListener(consoleListener);
process.on('SIGINT', () => {
  mainStory.debug('startup', 'CTRL-C received');
  process.exit(0);
});

process.on('unhandledRejection', err => {
  console.error(err); // eslint-disable-line
  process.exit(1);
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
  const gqlSchema = gqlInit();
  const httpServer = httpInit({ port: cliOptions.port });
  const socketServer = socketInit({ httpServer, gqlSchema });
  addListener(wsServerListener, { socketServer });
}
opn(`http://localhost:${cliOptions.port}/mady`).catch(err => {
  mainStory.error('OPN error', { attach: err });
});
