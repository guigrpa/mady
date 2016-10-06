import Promise              from 'bluebird';
import { mainStory, addListener } from 'storyboard';
import consoleListener      from 'storyboard/lib/listeners/console';
import program              from 'commander';
import opn                  from 'opn';
import * as db              from './db';
import * as gqlServer       from './gqlServer';
import * as httpServer      from './httpServer';

const pkg                   = require('../../package.json');

Promise.longStackTraces();

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
  .option('-d, --dir [dir]', 'Relative path to locale folder', DEFAULT_LOCALE_PATH)
  .option('-p, --port [port]', 'Initial port number to use ' +
    '(if unavailable, the next available one will be used)', Number, DEFAULT_PORT)
  .option('--recompile', 'Recompile translations upon launch')
  .option('--importV0 [dir]', 'Import a "v0" (old) locale folder')
  .parse(process.argv);

const launchPars = {
  localeDir: program.dir,
  port: program.port,
};

mainStory.info('startup', 'Launch parameters:', { attach: launchPars });
db.init({ localeDir: launchPars.localeDir, fRecompile: program.recompile });
if (program.importV0) {
  db.importV0(program.importV0);
} else {
  gqlServer.init();
  httpServer.init({ port: launchPars.port });
}
opn(`http://localhost:${launchPars.port}/`);
