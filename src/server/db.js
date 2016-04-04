// @flow

import path                 from 'path';
import fs                   from 'fs-extra';
import { mainStory, chalk } from 'storyboard-core';

let _localeDir = null;
let _keyPath = null;
let _configPath = null;
let _config = null;
let _keys = null;

const DEFAULT_CONFIG = {
  srcPaths: ['src'],
  srcExtensions: ['.js', '.jsx', '.coffee', '.cjsx'],
  languages: ['en_US'],
};

// ==============================================
// Public API
// ==============================================
export function init(config: Object) {
  _initLocaleDir();
  _initConfig();
  _initKeys();
}

export function saveConfig(config: Object) { saveJson(_configPath, _config); }
export function saveKeys(keys: Object) { saveJson(_keyPath, _keys); }

export function saveJson(filePath: string, obj: Object) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, '  '));
}

// ==============================================
// Helpers
// ==============================================
function _initLocaleDir() {
  _localeDir = config.localeDir;
  try {
    fs.statSync(_localeDir);
  } catch (err) {
    mainStory.info('db', `Creating folder ${chalk.cyan.bold(_localeDir)}...`);
    fs.mkdirSync(_localeDir);
  }
}

function _initConfig() {
  _configPath = path.join(_localeDir, 'config.json');
  try {
    fs.statSync(_configPath);
  } catch (err) {
    mainStory.info('db', `Creating file ${chalk.cyan.bold(_configPath)}...`);
    _config = DEFAULT_CONFIG;
    saveConfig();
  }
}

function _initKeys() {
  _keyPath = path.join(_localeDir, 'keys.json');
  try {
    fs.statSync(_keyPath);
  } catch (err) {
    mainStory.info('db', `Creating file ${chalk.cyan.bold(_keyPath)}...`);
    _keys = {};
    saveKeys();
  }
}
