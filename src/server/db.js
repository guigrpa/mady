import path                 from 'path';
import fs                   from 'fs-extra';
import timm                 from 'timm';
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
  _initTranslations();
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
    mainStory.debug('db', `Creating folder ${chalk.cyan.bold(_localeDir)}...`);
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
    mainStory.debug('db', `Creating file ${chalk.cyan.bold(_configPath)}...`);
    _config = DEFAULT_CONFIG;
    saveConfig();
  } finally {
    mainStory.info('db', `Reading file ${chalk.cyan.bold(_configPath)}...`);
    readConfig();
  }
}

function readConfig() { _config = readJson(_configPath); }
function saveConfig() { saveJson(_configPath, _config); }

export function getConfig() { return _config; }
export function updateConfig(newAttrs) {
  _config = timm.merge(_config, newAttrs);
  saveConfig();
}


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
    mainStory.debug('db', `Creating file ${chalk.cyan.bold(_keyPath)}...`);
    _keys = {};
    saveKeys();
  } finally {
    mainStory.info('db', `Reading file ${chalk.cyan.bold(_keyPath)}...`);
    readKeys();
  }
}

function readKeys() { _keys = readJson(_keyPath); }
function saveKeys() { saveJson(_keyPath, _keys); }

export function getKeys() { return Object.keys(_keys).map(id => _keys[id]); }
export function getKey(id) { return _keys[id]; }
export function createKey(newAttrs) {
  const id = newAttrs.context != null
    ? `${newAttrs.context}_${newAttrs.text}`
    : newAttrs.text;
  _keys[id] = {
    id,
    context: newAttrs.context || null,
    text: newAttrs.text,
    firstUsed: newAttrs.firstUsed,
    unusedSince: newAttrs.unusedSince || null,
    sources: [],
  };
  saveKeys();
  return id;
}
export function updateKey(id, newAttrs) {
  _keys[id] = timm.merge(_keys[id], newAttrs);
  saveKeys();
}
export function deleteKey(id) {
  _keys[id] = undefined;
  saveKeys();
}
export function parseSrcFiles() {
  const { srcPaths, srcExtensions } = _config;
  const story = mainStory.child({ src: 'db', title: 'Parse source files' });
  const curKeys = parse({ srcPaths, srcExtensions, story });
  const now = new Date().toISOString();

  let numUnused = 0;
  Object.keys(_keys).forEach(id => {
    const key = _keys[id];
    if (curKeys[id]) {
      curKeys[id].firstUsed = key.firstUsed;
    } else {
      story.debug('db', `${chalk.magenta.bold('Unused')} key: ${id}`);
      curKeys[id] = key;
      key.unusedSince = key.unusedSince || now;
      key.sources = [];
      numUnused++;
    }
  });

  Object.keys(curKeys).forEach(id => {
    const key = curKeys[id];
    if (!key.firstUsed) {
      story.debug('db', `${chalk.green.bold('New')} key: ${id}`);
      key.firstUsed = now;
    }
    _keys[id] = key;
  });

  saveKeys();
  story.close();
  return _keys;
}


// ==============================================
// Translations
// ==============================================
const getLangPath = (lang) => path.join(_localeDir, `${lang}.json`);
let _translations = {};

function _initTranslations() {
  for (const lang of _config.langs) {
    const langPath = getLangPath(lang);
    try {
      fs.statSync(langPath);
    } catch (err) {
      mainStory.debug('db', `Creating file ${chalk.cyan.bold(langPath)}...`);
      saveJson(langPath, {});
    } finally {
      mainStory.info('db', `Reading file ${chalk.cyan.bold(langPath)}...`);
      readTranslations(lang);
    }
  }
}

function readTranslations(lang) {
  const translations = readJson(getLangPath(lang));
  if (translations) {
    _translations = timm.merge(_translations, translations);
  }
}
function saveTranslations(lang) { saveJson(getLangPath(lang), getTranslations(lang)); }

export function getTranslations(lang) {
  const out = [];
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (lang == null || translation.lang === lang) {
      out.push(translation);
    }
  });
  return out;
}
export function getTranslation(id) { return _translations[id]; }


// ==============================================
// Helpers
// ==============================================
function readJson(filePath: string): Object {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}
export function saveJson(filePath: string, obj: Object) {
  fs.writeFileSync(filePath, JSON.stringify(obj, null, '  '), 'utf8');
}
