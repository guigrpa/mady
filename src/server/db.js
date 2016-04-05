import path                 from 'path';
import fs                   from 'fs-extra';
import { mainStory, chalk } from 'storyboard';
import parse                from './parser';

const DEFAULT_CONFIG = {
  srcPaths: ['src'],
  srcExtensions: ['.js', '.jsx', '.coffee', '.cjsx'],
  langs: ['en_US'],
};

// ==============================================
// Main API
// ==============================================
export function init(options: Object) {
  _initLocaleDir(options);
  _initConfig();
  _initKeys();
}


// ==============================================
// Locale dir
// ==============================================
let _localeDir = null;

function _initLocaleDir(options: Object) {
  _localeDir = options.localeDir;
  try {
    fs.statSync(_localeDir);
  } catch (err) {
    mainStory.info('db', `Creating folder ${chalk.cyan.bold(_localeDir)}...`);
    fs.mkdirSync(_localeDir);
  }
}


// ==============================================
// Config
// ==============================================
let _configPath = null;
let _config = null;

function _initConfig() {
  _configPath = path.join(_localeDir, 'config.json');
  try {
    fs.statSync(_configPath);
  } catch (err) {
    mainStory.info('db', `Creating file ${chalk.cyan.bold(_configPath)}...`);
    _config = DEFAULT_CONFIG;
    saveConfig();
  } finally { readConfig(); }
}

export function getConfig() { return _config; }
export function readConfig() { _config = readJson(_configPath); }
export function saveConfig() { saveJson(_configPath, _config); }


// ==============================================
// Keys
// ==============================================
let _keyPath = null;
let _keys = null;

function _initKeys() {
  _keyPath = path.join(_localeDir, 'keys.json');
  try {
    fs.statSync(_keyPath);
  } catch (err) {
    mainStory.info('db', `Creating file ${chalk.cyan.bold(_keyPath)}...`);
    _keys = [];
    saveKeys();
  } finally { readKeys(); }
}

export function getKeys() { return _keys; }
export function getKey(id) { return _keys.find(o => o.id === id); }
export function readKeys() { _keys = readJson(_keyPath); }
export function saveKeys() { saveJson(_keyPath, _keys); }

export function updateKeys() {
  const { srcPaths, srcExtensions } = _config;
  const curKeys = parse({ srcPaths, srcExtensions });
  const now = new Date().toISOString();

  let numUnused = 0;
  for (const key of _keys) {
    const id = key.id;
    if (curKeys[id]) {
      curKeys[id].firstUsed = key.firstUsed;
    } else {
      mainStory.debug('db', `Unused key: ${id}`);
      curKeys[id] = key;
      key.unusedSince = key.unusedSince || now;
      key.sources = [];
      numUnused++;
    }
  }

  _keys = Object.keys(curKeys).map((id) => {
    const key = curKeys[id];
    if (!key.firstUsed) {
      mainStory.debug('db', `New key: ${id}`);
      key.firstUsed = now;
    }
    return key;
  });

  saveKeys();
}


// ==============================================
// Helpers
// ==============================================
function readJson(filePath: string): Object {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
export function saveJson(filePath: string, obj: Object) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, '  '), 'utf8');
}
