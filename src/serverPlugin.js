// @flow

import * as db from './server/db';
import { init as gqlInit } from './server/graphql/gqlServer';
import { init as httpInit } from './server/httpServer';
import { init as socketInit } from './server/socketServer';

type Options = {|
  expressApp: Object,
  httpServer: Object,
  socketServer?: Object,
  localeDir?: string,
  otherLocaleDirs?: Array<string>,
  onChange?: Function,
  noWatch?: boolean,
  noAutoTranslateNewKeys?: boolean,
|};

const DEFAULT_LOCALE_PATH = 'locales';

const init = (options: Options) => {
  const localeDir = options.localeDir || DEFAULT_LOCALE_PATH;
  const {
    expressApp,
    httpServer,
    socketServer,
    otherLocaleDirs,
    onChange,
    noWatch,
    noAutoTranslateNewKeys,
  } = options;
  if (!expressApp) throw new Error('expressApp option not provided');
  if (!httpServer) throw new Error('httpServer option not provided');
  db.init({
    localeDir,
    fRecompile: false,
    otherLocaleDirs,
    onChange,
    watch: !noWatch,
    autoTranslateNewKeys: !noAutoTranslateNewKeys,
  });
  const gqlSchema = gqlInit();
  httpInit({ expressApp, httpServer });
  socketInit({ httpServer, socketServer, gqlSchema });
};

export default init;
