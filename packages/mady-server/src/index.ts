#!/usr/bin/env node

import path from 'path';
import fs from 'fs-extra';
import { mainStory, addListener } from 'storyboard';
import consoleListener from 'storyboard-listener-console';
import wsServerListener from 'storyboard-listener-ws-server';
import program from 'commander';
import opn from 'opn';
import { init as httpInit } from './httpServer';
import { init as dbInit, compileTranslations } from './db';

const pkg = fs.readJsonSync(path.join(__dirname, '..', 'package.json'));

const DEFAULT_LOCALE_PATH = 'locales';
const DEFAULT_PORT = 8080;
const SRC = 'mady';

addListener(consoleListener);

process.on('unhandledRejection', (err) => {
  mainStory.error(SRC, 'An error occurred', { attach: err });
});

// ==============================================
// Program options
// ==============================================
program
  .version(pkg.version)
  .option(
    '-d, --dir [dir]',
    'Relative path to locale folder',
    DEFAULT_LOCALE_PATH
  )
  .option(
    '--other-dirs [dirs]',
    'Comma-separated relative paths to other Mady locale folders (e.g. libs)',
    ''
  )
  .option(
    '-p, --port [port]',
    'Initial port number to use ' +
      '(if unavailable, the next available one will be used)',
    Number,
    DEFAULT_PORT
  )
  .option('--no-watch', 'Do not watch source files')
  .option('--no-open', 'Do not open web browser on launch')
  .option(
    '--no-auto-translate-new-keys',
    'Do not automatically translate new keys'
  )
  .option('--recompile', 'Recompile translations and exit')
  .parse(process.argv);

const cliOptions = program.opts();
cliOptions.otherDirs = cliOptions.otherDirs
  ? cliOptions.otherDirs.split(',')
  : [];

// ==============================================
// Main
// ==============================================
const run = async () => {
  mainStory.info(SRC, 'Starting...');
  mainStory.info(SRC, 'CLI options:', { attach: cliOptions });
  dbInit({
    localeDir: cliOptions.dir,
    otherLocaleDirs: cliOptions.otherDirs,
    watch: !!cliOptions.watch && !cliOptions.recompile,
    autoTranslateNewKeys: !!cliOptions.autoTranslateNewKeys,
  });
  if (cliOptions.recompile) {
    await compileTranslations();
  } else {
    const { port } = cliOptions;
    const httpServer = httpInit({ port });
    addListener(wsServerListener, { httpServer });
    if (cliOptions.open) {
      opn(`http://localhost:${port}/mady`).catch((err: Error) => {
        mainStory.error(SRC, 'Error opening the browser', { attach: err });
      });
    }
  }
};

run();
