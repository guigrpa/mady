/* eslint-disable global-require */
import fs                   from 'fs';
import path                 from 'path';
import slash                from 'slash';
import { mainStory, chalk } from 'storyboard';
import diveSync             from 'diveSync';
import { utf8ToBase64 }     from '../common/base64';

// Enable react-intl integration only when we have the necessary packages
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
    const babelrc = JSON.parse(fs.readFileSync('.babelrc'));
    if (babelrc.presets) babelConfig.presets = babelConfig.presets.concat(babelrc.presets);
    if (babelrc.plugins) babelConfig.plugins = babelrc.plugins.concat(babelConfig.plugins);
  } catch (err) {
    mainStory.warn('parser',
      'Could not find your .babelrc file; using default config for React Intl integration');
  }
} catch (err) {
  mainStory.warn('parser', 'Disabled React Intl integration');
  // eslint-disable-line max-len
  mainStory.warn('parser',
    'If you need it, make sure you install babel-core and babel-plugin-react-intl');
}

// const REGEXP_TRANSLATE_CMDS = [
//   /_t\s*\(\s*"(.*?)"/g,
//   /_t\s*\(\s*'(.*?)'/g,
// ];

const getRegexps = (msgFunctionNames) => {
  const out = [];
  msgFunctionNames.forEach((fnName) => {
    const escapedFnName = fnName.replace(/([\$])/g, '\\$1');

    // Looking for something like:
    // * i18n("xk s fjkl")
    // * i18n ( "xk s fjkl")
    // * i18n('xk s fjkl')
    out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*"([\\s\\S]*?)"`, 'gm'));
    out.push(new RegExp(`${escapedFnName}\\s*\\(\\s*'([\\s\\S]*?)'`, 'gm'));
  });
  return out;
};

const parse = ({ srcPaths, srcExtensions, msgFunctionNames, story }) => {
  const regexpFunctionNames = getRegexps(msgFunctionNames);
  const keys = {};
  const diveOptions = { filter: (filePath, fDir) => {
    if (fDir) return true;
    return (srcExtensions.indexOf(path.extname(filePath)) >= 0);
  } };
  const diveProcess = (err, filePath) => {
    const finalFilePath = path.normalize(filePath);
    story.info('parser', `Processing ${chalk.cyan.bold(finalFilePath)}...`);
    const fileContents = fs.readFileSync(finalFilePath);
    parseFunctionCalls(keys, finalFilePath, fileContents, regexpFunctionNames);
    if (fReactIntl) parseReactIntl(keys, finalFilePath, fileContents, story);
  };
  srcPaths.forEach((srcPath) => diveSync(srcPath, diveOptions, diveProcess));
  return keys;
};

const parseFunctionCalls = (keys, filePath, fileContents, regexpFunctionNames) => {
  regexpFunctionNames.forEach((re) => {
    let match;
    while ((match = re.exec(fileContents))) {
      addMessageToKeys(keys, match[1], filePath);
    }
  });
};

const parseReactIntl = (keys, filePath, fileContents, story) => {
  try {
    const { messages } = babelCore.transform(fileContents, babelConfig).metadata['react-intl'];
    if (messages) {
      messages.forEach((message) => {
        const { defaultMessage: utf8, description, id: reactIntlId } = message;
        addMessageToKeys(keys, utf8, filePath, { reactIntlId, description });
      });
    }
  } catch (err2) {
    story.error('parser', 'Error extracting React Intl messages', { attach: err2 });
  }
};

const addMessageToKeys = (keys, utf8, filePath, extras = {}) => {
  const tokens = utf8.split('_');
  let context;
  let text;
  if (tokens.length >= 2) {
    context = tokens.shift();
    text = tokens.join('_');
  } else {
    context = null;
    text = tokens[0];
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
// Public API
// ======================================================
export default parse;

// Only for unit tests
export {
  getRegexps as _getRegexps,
  parseFunctionCalls as _parseFunctionCalls,
  parseReactIntl as _parseReactIntl,
};
