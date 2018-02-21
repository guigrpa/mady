// @flow

/* eslint-disable global-require */

import fs from 'fs';
import path from 'path';
import slash from 'slash';
import { mainStory, chalk } from 'storyboard';
import diveSync from 'diveSync';
import { utf8ToBase64 } from '../common/base64';
import type { MapOf, StoryT, InternalKeyT } from '../common/types';

// ======================================================
// Enable react-intl integration only when we have the necessary packages
// ======================================================
let fReactIntl = false;
let babelCore;
const babelConfig = {
  presets: [],
  plugins: ['react-intl'],
};
try {
  babelCore = require('babel-core');
  require('babel-plugin-react-intl');

  fReactIntl = true;
  try {
    const babelrc = JSON.parse(fs.readFileSync('.babelrc', 'utf8'));
    if (babelrc.presets)
      babelConfig.presets = babelConfig.presets.concat(babelrc.presets);
    if (babelrc.plugins)
      babelConfig.plugins = babelrc.plugins.concat(babelConfig.plugins);
  } catch (err) {
    mainStory.warn(
      'parser',
      'Could not find your .babelrc file; using default config for React Intl integration'
    );
  }
} catch (err) {
  mainStory.warn('parser', 'Disabled React Intl integration');
  // eslint-disable-line max-len
  mainStory.warn(
    'parser',
    'If you need it, make sure you install babel-core and babel-plugin-react-intl'
  );
}

// ======================================================
// Entry points
// ======================================================
const parseAll = ({
  srcPaths,
  srcExtensions,
  msgFunctionNames,
  msgRegexps,
  localeDir,
  story,
}: {|
  srcPaths: Array<string>,
  srcExtensions: Array<string>,
  msgFunctionNames: Array<string>,
  msgRegexps: Array<string>,
  localeDir: string,
  story: StoryT,
|}): MapOf<InternalKeyT> => {
  const regexps = getRegexps(msgFunctionNames, msgRegexps);
  const keys = {};
  const diveOptions = {
    filter: (filePath, fDir) => {
      if (fDir) return true;
      return srcExtensions.indexOf(path.extname(filePath)) >= 0;
    },
  };
  srcPaths.forEach(srcPath =>
    diveSync(srcPath, diveOptions, (err, filePath) => {
      parseFile(filePath, keys, { regexps, story });
    })
  );
  processGetExtraMessagesHook(localeDir, keys);
  return keys;
};

const parseOne = ({
  filePath,
  msgFunctionNames,
  msgRegexps,
  story,
}: {|
  filePath: string,
  msgFunctionNames: Array<string>,
  msgRegexps: Array<string>,
  story: StoryT,
|}): MapOf<InternalKeyT> => {
  const regexps = getRegexps(msgFunctionNames, msgRegexps);
  const keys = {};
  parseFile(filePath, keys, { regexps, story });
  return keys;
};

// ======================================================
// File parser (& friends)
// ======================================================
const parseFile = (filePath, keys, { regexps, story }) => {
  const finalFilePath = path.normalize(filePath);
  story.info('parser', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
  const fileContents = fs.readFileSync(finalFilePath, 'utf8');
  parseWithRegexps(keys, finalFilePath, fileContents, regexps);
  if (fReactIntl) parseReactIntl(keys, finalFilePath, fileContents, story);
};

const parseWithRegexps = (
  keys: MapOf<InternalKeyT>,
  filePath: string,
  fileContents: string,
  regexps: Array<RegExp>
): void => {
  regexps.forEach(re => {
    let match;
    while ((match = re.exec(fileContents))) {
      addMessageToKeys(keys, match[1], filePath);
    }
  });
};

const parseReactIntl = (
  keys: MapOf<InternalKeyT>,
  filePath: string,
  fileContents: string,
  story: StoryT
): void => {
  try {
    const { messages } = babelCore.transform(
      fileContents,
      babelConfig
    ).metadata['react-intl'];
    if (messages) {
      messages.forEach(message => {
        const { defaultMessage: utf8, description, id: reactIntlId } = message;
        addMessageToKeys(keys, utf8, filePath, { reactIntlId, description });
      });
    }
  } catch (err2) {
    story.error('parser', 'Error extracting React Intl messages', {
      attach: err2,
    });
  }
};

const addMessageToKeys = (
  keys: MapOf<InternalKeyT>,
  utf8: string,
  filePath: string,
  extras?: { context?: ?string } = {}
): void => {
  let text = utf8;
  let { context } = extras;
  if (context === undefined) {
    const tokens = utf8.split('_');
    if (tokens.length >= 2) {
      context = tokens.shift();
      text = tokens.join('_');
    } else {
      context = null;
      text = tokens[0];
    }
  }
  const base64 = utf8ToBase64(utf8);
  // eslint-disable-next-line no-param-reassign
  keys[base64] = keys[base64] || {
    id: base64,
    context,
    text,
    ...extras,
    firstUsed: null,
    unusedSince: null,
    sources: [],
  };
  keys[base64].sources.push(slash(filePath));
};

// ======================================================
// Helpers
// ======================================================
// const REGEXP_TRANSLATE_CMDS = [
//   /_t\s*\(\s*"(.*?)"/g,
//   /_t\s*\(\s*'(.*?)'/g,
// ];

const getRegexps = (
  msgFunctionNames: Array<string>,
  msgRegexps: Array<string>
): Array<RegExp> => {
  const out = [];
  if (msgFunctionNames) {
    msgFunctionNames.forEach(fnName => {
      // Escape $ characters, which are legal in function names
      const escapedFnName = fnName.replace(/([\$])/g, '\\$1'); // eslint-disable-line

      // Looking for something like:
      // * i18n("xk s fjkl"   [other arguments to the function are not parsed]
      // * i18n ( "xk s fjkl"
      // * i18n('xk s fjkl'
      out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*"([\\s\\S]*?)"`, 'gm'));
      out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*'([\\s\\S]*?)'`, 'gm'));
    });
  }
  if (msgRegexps) {
    msgRegexps.forEach(reStr => {
      out.push(new RegExp(reStr, 'gm'));
    });
  }
  return out;
};

const processGetExtraMessagesHook = (localeDir, keys) => {
  let getExtraMessages;
  try {
    const hookPath = path.join(process.cwd(), localeDir, 'getExtraMessages');
    // $FlowFixMe
    getExtraMessages = require(hookPath); // eslint-disable-line
  } catch (err) {
    /* ignore */
  }
  if (!getExtraMessages) return;
  const extraMessages = getExtraMessages();
  if (extraMessages == null) return;
  extraMessages.forEach(({ text, isMarkdown, scope, filePath }) => {
    addMessageToKeys(keys, text, filePath, {
      isMarkdown,
      scope,
      context: null,
    });
  });
};

// ======================================================
// Public API
// ======================================================
export default parseAll;

export {
  parseAll,
  parseOne,
  // Only for unit tests
  getRegexps as _getRegexps,
  parseWithRegexps as _parseWithRegexps,
  parseReactIntl as _parseReactIntl,
};
