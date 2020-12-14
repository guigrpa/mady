/* eslint-disable global-require */

import fs from 'fs';
import path from 'path';
import slash from 'slash';
import { mainStory, chalk } from 'storyboard';
import { encode } from 'js-base64';
import diveSync from 'diveSync';
import type { Key, Keys } from './types';

const SRC = 'mady-parse';

// ======================================================
// Entry points
// ======================================================
const parseAll = ({
  srcPaths,
  srcExtensions,
  msgFunctionNames,
  msgRegexps,
  localeDir,
}: {
  srcPaths: string[];
  srcExtensions: string[];
  msgFunctionNames: string[];
  msgRegexps: string[];
  localeDir: string;
}) => {
  const regexps = getRegexps(msgFunctionNames, msgRegexps);
  const keys: Keys = {};
  const diveOptions = {
    filter: (filePath: string, fDir: boolean) => {
      if (fDir) return true;
      return srcExtensions.indexOf(path.extname(filePath)) >= 0;
    },
  };
  srcPaths.forEach((srcPath) =>
    diveSync(srcPath, diveOptions, (err: Error, filePath: string) => {
      if (err) {
        mainStory.info(
          SRC,
          `Could not read dir ${chalk.cyan.bold(srcPath)}...`,
          { attach: err }
        );
        return;
      }
      parseFile(filePath, keys, regexps);
    })
  );
  processGetExtraMessagesHook(localeDir, keys);
  return keys;
};

type OptionsOne = {
  filePath: string;
  msgFunctionNames: string[];
  msgRegexps: string[];
};
const parseOne = ({ filePath, msgFunctionNames, msgRegexps }: OptionsOne) => {
  const regexps = getRegexps(msgFunctionNames, msgRegexps);
  const keys: Keys = {};
  parseFile(filePath, keys, regexps);
  return keys;
};

// ======================================================
// File parser (& friends)
// ======================================================
const parseFile = (filePath: string, keys: Keys, regexps: RegExp[]) => {
  const finalFilePath = path.normalize(filePath);
  mainStory.info(SRC, `Parsing ${chalk.cyan.bold(finalFilePath)}...`);
  const fileContents = fs.readFileSync(finalFilePath, 'utf8');
  parseWithRegexps(keys, finalFilePath, fileContents, regexps);
};

const parseWithRegexps = (
  keys: Keys,
  filePath: string,
  fileContents: string,
  regexps: RegExp[]
): void => {
  regexps.forEach((re) => {
    let match;
    while ((match = re.exec(fileContents))) {
      addMessageToKeys(keys, match[1], filePath);
    }
  });
};

const addMessageToKeys = (
  keys: Keys,
  utf8: string,
  filePath: string,
  extras: Partial<Key> = {}
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
  const base64 = encode(utf8);
  // eslint-disable-next-line no-param-reassign
  keys[base64] = keys[base64] || {
    id: base64,
    ...extras,
    context,
    text,
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

const getRegexps = (msgFunctionNames?: string[], msgRegexps?: string[]) => {
  const out: RegExp[] = [];
  if (msgFunctionNames) {
    msgFunctionNames.forEach((fnName) => {
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
    msgRegexps.forEach((reStr) => {
      out.push(new RegExp(reStr, 'gm'));
    });
  }
  return out;
};

type ExtraMessage = {
  text: string;
  context?: string;
  seq?: number;
  isMarkdown: boolean;
  scope: string;
  filePath: string;
};
const processGetExtraMessagesHook = (localeDir: string, keys: Keys) => {
  let getExtraMessages;
  try {
    const hookPath = path.join(process.cwd(), localeDir, 'getExtraMessages');
    getExtraMessages = require(hookPath);
  } catch (err) {
    /* ignore */
  }
  if (!getExtraMessages) return;
  const extraMessages = getExtraMessages();
  if (!extraMessages) return;
  extraMessages.forEach(
    ({ text, context, seq, isMarkdown, scope, filePath }: ExtraMessage) => {
      addMessageToKeys(keys, text, filePath, {
        isMarkdown,
        scope,
        context,
        seq,
      });
    }
  );
};

// ======================================================
// Public API
// ======================================================
export {
  parseAll,
  parseOne,
  // Only for unit tests
  getRegexps as _getRegexps,
  parseWithRegexps as _parseWithRegexps,
};
