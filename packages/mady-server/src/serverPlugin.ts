import type { Express } from 'express';
import * as db from './db';
import { init as httpInit } from './httpServer';

type Options = {
  expressApp: Express;
  apiBase?: string;
  uiBase?: string;
  localeDir?: string;
  otherLocaleDirs?: Array<string>;
  noWatch?: boolean;
  noAutoTranslateNewKeys?: boolean;
  onChange?: Function;
};

const DEFAULT_LOCALE_PATH = 'locales';

const init = async (options: Options) => {
  const localeDir = options.localeDir || DEFAULT_LOCALE_PATH;
  const {
    expressApp,
    apiBase,
    uiBase,
    otherLocaleDirs,
    onChange,
    noWatch,
    noAutoTranslateNewKeys,
  } = options;
  if (!expressApp) throw new Error('expressApp option not provided');
  db.init({
    localeDir,
    otherLocaleDirs,
    watch: !noWatch,
    autoTranslateNewKeys: !noAutoTranslateNewKeys,
    onChange,
  });
  httpInit({ expressApp, apiBase, uiBase });
  return db;
};

export default init;
