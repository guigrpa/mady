import path                 from 'path';
import fs                   from 'fs-extra';
import timm                 from 'timm';
import { mainStory, chalk } from 'storyboard';
import { debounce }         from 'lodash';
import uuid                 from 'node-uuid';
import parse                from './parseSources';
import compile              from './compileTranslations';
import * as importers       from './importData';

const DEFAULT_CONFIG = {
  srcPaths: ['src'],
  srcExtensions: ['.js', '.jsx', '.coffee', '.cjsx'],
  langs: ['en-US'],
  fMinify: false,
};

const DEBOUNCE_COMPILE = 1000;     // [ms]

// ==============================================
// Init
// ==============================================
function init(options: Object) {
  initLocaleDir(options);
  initConfig();
  initKeys();
  initTranslations();
}


// ==============================================
// Locale dir
// ==============================================
let _localeDir = null;

function initLocaleDir(options: Object) {
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

function initConfig() {
  _configPath = path.join(_localeDir, 'config.json');
  try {
    fs.statSync(_configPath);
  } catch (err) {
    _config = DEFAULT_CONFIG;
    saveConfig();
  } finally {
    mainStory.info('db', `Reading file ${chalk.cyan.bold(_configPath)}...`);
    readConfig();
  }
}

function readConfig() {
  _config = timm.addDefaults(readJson(_configPath), DEFAULT_CONFIG);
}
function saveConfig(options) { saveJson(_configPath, _config, options); }

function getConfig() { return _config; }

function updateConfig(newAttrs, { story }) {
  _config = timm.merge(_config, newAttrs);
  story.debug('db', 'New config:', { attach: _config });
  saveConfig({ story });
  compileTranslations();
  return _config;
}


// ==============================================
// Keys
// ==============================================
let _keyPath = null;
let _keys = {};

function initKeys() {
  _keyPath = path.join(_localeDir, 'keys.json');
  try {
    fs.statSync(_keyPath);
  } catch (err) {
    saveKeys();
  } finally {
    mainStory.info('db', `Reading file ${chalk.cyan.bold(_keyPath)}...`);
    readKeys();
  }
}

function readKeys() { _keys = readJson(_keyPath); }

function saveKeys(options) { saveJson(_keyPath, _keys, options); }

function getKeys() { return Object.keys(_keys).map(id => _keys[id]); }

function getKey(id) { return _keys[id]; }

function createKey(newAttrs) {
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
  compileTranslations();
  return _keys[id];
}

function updateKey(id, newAttrs) {
  _keys[id] = timm.merge(_keys[id], newAttrs);
  saveKeys();
  compileTranslations();
  return _keys[id];
}

function deleteKey(id) {
  const item = _keys[id];
  delete _keys[id];
  saveKeys();
  compileTranslations();
  return item;
}

function parseSrcFiles({ story }) {
  const { srcPaths, srcExtensions } = _config;
  const curKeys = parse({ srcPaths, srcExtensions, story });
  const now = new Date().toISOString();

  const unusedKeys = [];
  Object.keys(_keys).forEach(id => {
    const key = _keys[id];
    if (curKeys[id]) {
      curKeys[id].firstUsed = key.firstUsed;
    } else {
      unusedKeys.push(id);
      curKeys[id] = key;
      key.unusedSince = key.unusedSince || now;
      key.sources = [];
    }
  });
  if (unusedKeys.length) {
    story.debug('db', `${chalk.bold('Unused')} keys: ${unusedKeys.length}`, {
      attach: unusedKeys,
    });
  }

  const newKeys = [];
  Object.keys(curKeys).forEach(id => {
    const key = curKeys[id];
    if (!key.firstUsed) {
      newKeys.push(id);
      key.firstUsed = now;
    }
    _keys[id] = key;
  });
  if (newKeys.length) {
    story.debug('db', `${chalk.bold('New')} keys: ${newKeys.length}`, {
      attach: newKeys,
    });
  }

  saveKeys({ story });
  compileTranslations();
  return _keys;
}


// ==============================================
// Translations
// ==============================================
const getLangPath = (lang) => path.join(_localeDir, `${lang}.json`);
const getCompiledLangPath = (lang) => path.join(_localeDir, `${lang}.js`);
let _translations = {};

function initTranslations() {
  for (const lang of _config.langs) {
    const langPath = getLangPath(lang);
    try {
      fs.statSync(langPath);
    } catch (err) {
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

function saveTranslations(lang, options) {
  const langTranslations = {};
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (translation.lang === lang) {
      langTranslations[translation.id] = translation;
    }
  });
  saveJson(getLangPath(lang), langTranslations, options);
}

function getTranslations() {
  return Object.keys(_translations).map(id => _translations[id]);
}

function getLangTranslations(lang) {
  const out = [];
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (translation.lang === lang) {
      out.push(translation);
    }
  });
  return out;
}

function getKeyTranslations(keyId) {
  const out = [];
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (translation.keyId === keyId) {
      out.push(translation);
    }
  });
  return out;
}

function getTranslation(id) { return _translations[id]; }

function createTranslation(newAttrs, { story }) {
  const { lang, translation, keyId } = newAttrs;
  if (!lang) throw new Error('Translation language must be specified');
  if (keyId == null) throw new Error('Translation key must be specified');
  const id = uuid.v4();
  _translations[id] = { id, lang, translation, keyId };
  saveTranslations(lang, { story });
  compileTranslations();
  return _translations[id];
}

function updateTranslation(id, newAttrs, { story }) {
  _translations[id] = timm.merge(_translations[id], newAttrs);
  saveTranslations(_translations[id].lang, { story });
  compileTranslations();
  return _translations[id];
}

function deleteTranslation(id, { story }) {
  const item = _translations[id];
  const { lang } = _translations[id];
  delete _translations[id];
  saveTranslations(lang, { story });
  compileTranslations();
  return item;
}

function _compileTranslations() {
  const story = mainStory.child({
    src: 'db',
    title: 'Compile translations',
  })
  for (const lang of _config.langs) {
    const compiledLangPath = getCompiledLangPath(lang);
    const translations = getLangTranslations(lang);
    const { fMinify } = _config;
    const fnTranslate = compile({ lang, keys: _keys, translations, fMinify, story });
    story.debug('db', `Writing file ${chalk.cyan.bold(compiledLangPath)}...`);
    fs.writeFileSync(compiledLangPath, fnTranslate, 'utf8');
  }
  story.close();
}
const compileTranslations = debounce(_compileTranslations, DEBOUNCE_COMPILE);

// ==============================================
// Merge keys and translations from old stores
// ==============================================
function importV0(dir: string) {
  const story = mainStory.child({
    src: 'db',
    title: 'Import v0',
  });
  const { langs, keys, translations } = importers.importV0({
    langs: _config.langs,
    keys: _keys,
    translations: _translations,
    dir, story,
  });
  if (langs !== _config.langs) updateConfig({ langs }, { story });
  if (keys !== _keys) {
    _keys = keys;
    saveKeys({ story });
  }
  if (translations !== _translations) {
    _translations = translations;
    for (const lang of _config.langs) {
      saveTranslations(lang, { story });
    }
  }
  compileTranslations();
  story.close();
}

// ==============================================
// Helpers
// ==============================================
function readJson(filePath: string): Object {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(
  filePath: string,
  obj: Object,
  { story = mainStory } = {}: Object
) {
  story.debug('db', `Writing file ${chalk.cyan.bold(filePath)}...`);
  fs.writeFileSync(filePath, JSON.stringify(obj, null, '  '), 'utf8');
}

// ==============================================
// Public API
// ==============================================
export {
  init,

  getConfig, updateConfig,
  getKeys, getKey, createKey, updateKey, deleteKey,
  getTranslations, getLangTranslations, getKeyTranslations, getTranslation,
  createTranslation, updateTranslation, deleteTranslation,

  parseSrcFiles,
  compileTranslations,
  importV0,
  saveJson,
};
