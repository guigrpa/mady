// @flow

/* eslint-disable no-loop-func */

import path from 'path';
import fs from 'fs-extra';
import slash from 'slash';
import { addDefaults, merge } from 'timm';
import { mainStory, chalk } from 'storyboard';
import uuid from 'uuid';
import debounce from 'lodash/debounce';
import type {
  MapOf,
  StoryT,
  InternalConfigT,
  InternalStatsT,
  InternalKeyT,
  InternalTranslationT,
} from '../common/types';
import { parseAll, parseOne } from './parseSources';
import compile from './compileTranslations';
import collectReactIntlTranslations from './collectReactIntlTranslations';
import collectJsonTranslations from './collectJsonTranslations';
import * as importers from './importData';
import { publish } from './subscriptions';
import { init as initFileWatcher } from './fileWatcher';
import autoTranslate from './autoTranslate';

const DB_VERSION = 2;
const DEBOUNCE_SAVE = 2000;
const DEBOUNCE_COMPILE = 2000;
const { UNIT_TESTING } = process.env;

const DEFAULT_CONFIG = {
  srcPaths: ['src'],
  srcExtensions: ['.js', '.jsx'],
  langs: ['en'],
  originalLang: 'en',
  msgFunctionNames: ['_t'],
  msgRegexps: [],
  fMinify: false,
  fJsOutput: true,
  fJsonOutput: true,
  fReactIntlOutput: true,
  dbVersion: DB_VERSION,
};

const RESPONSE_DELAY = 0;

const delay = ms =>
  new Promise(resolve => {
    if (RESPONSE_DELAY) {
      mainStory.debug('db', `Waiting (${RESPONSE_DELAY} ms)...`);
    }
    setTimeout(resolve, ms);
  });

// ==============================================
// Init
// ==============================================
let _onChange: ?Function;

type Options = {
  fRecompile: boolean,
  localeDir: string,
  otherLocaleDirs?: Array<string>,
  onChange?: Function,
};
function init(options: Options) {
  _onChange = options.onChange;
  initLocaleDir(options);
  const fMigrated = initConfig();
  initKeys();
  initAutoTranslations();
  initTranslations();
  initStats();
  if (fMigrated || options.fRecompile) debouncedCompileTranslations();
}

// ==============================================
// Locale dir
// ==============================================
let _localeDir: string;
let _otherLocaleDirs: Array<string> = [];
function setLocaleDir(localeDir: string) {
  _localeDir = localeDir;
}

function initLocaleDir(options: Options) {
  _localeDir = options.localeDir;
  _otherLocaleDirs = options.otherLocaleDirs || [];
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
let _configPath: string;
let _config: InternalConfigT;

function setConfigPath(configPath: string) {
  _configPath = configPath;
}
function setConfig(config: InternalConfigT) {
  _config = config;
}

function initConfig(): boolean {
  _configPath = path.join(_localeDir, 'config.json');
  let fMigrated = false;
  try {
    mainStory.info('db', `Reading file ${chalk.cyan.bold(_configPath)}...`);
    fs.statSync(_configPath);
    readConfig();
    if (_config.dbVersion !== DB_VERSION) {
      migrateDatabase(_config.dbVersion);
      _config.dbVersion = DB_VERSION;
      fMigrated = true;
    }
    _config = addDefaults(_config, DEFAULT_CONFIG);
    saveConfig();
    return fMigrated;
  } catch (err) {
    mainStory.error('db', `Error reading config: ${err.message}`, {
      attach: err,
      attachLevel: 'trace',
    });
    _config = DEFAULT_CONFIG;
    saveConfig();
    return fMigrated;
  }
}

function readConfig() {
  _config = readJson(_configPath);
}
function saveConfig(options?: Object) {
  saveJson(_configPath, _config, options);
  initFileWatcher({ paths: _config.srcPaths, onEvent: onFileChange });
}

const onFileChange = async (eventType, filePath0) => {
  const filePath = slash(filePath0);
  if (eventType === 'unlink') {
    onSrcFileDeleted(filePath, { save: true });
  } else if (eventType === 'add') {
    onSrcFileAdded(filePath, { save: true });
  } else if (eventType === 'change') {
    await onSrcFileDeleted(filePath, { save: false });
    onSrcFileAdded(filePath, { save: true, forceSave: true });
  }
};

function getConfig(): InternalConfigT {
  return _config;
}

async function updateConfig(
  newAttrs: Object,
  { story }: { story: StoryT }
): Promise<InternalConfigT> {
  const prevLangs = _config.langs;
  const updatedConfig = merge(_config, newAttrs);
  _config = updatedConfig;
  story.debug('db', 'New config:', { attach: updatedConfig });
  saveConfig({ story });
  debouncedCompileTranslations({ story });
  await delay(RESPONSE_DELAY);
  publish('updatedConfig', { config: updatedConfig });
  updateStats();

  // If new langs have been added, add automatic translations
  const langs = _config.langs;
  let hasNewLangs = false;
  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    if (prevLangs.indexOf(lang) < 0) {
      hasNewLangs = true;
      break;
    }
  }
  if (hasNewLangs) {
    const keyIds = Object.keys(_keys);
    story.info('db', 'Fetching auto translations for new languages...');
    keyIds.forEach(keyId => {
      fetchAutomaticTranslationsForKey(keyId, { story });
    });
  }
  return updatedConfig;
}

// ==============================================
// Keys
// ==============================================
let _keyPath: string;
let _keys: MapOf<InternalKeyT> = {};

function setKeyPath(keyPath: string) {
  _keyPath = keyPath;
}
function setKeys(keys: MapOf<InternalKeyT>) {
  _keys = keys;
}

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

function readKeys() {
  _keys = readJson(_keyPath);
}
function saveKeys(options?: Object) {
  saveJson(_keyPath, _keys, options);
}

function getKeys(): Array<InternalKeyT> {
  return Object.keys(_keys)
    .map(id => _keys[id])
    .filter(o => !o.isDeleted);
}

function getKey(id: string): ?InternalKeyT {
  return _keys[id];
}

async function createKey(newAttrs: Object): Promise<?InternalKeyT> {
  const id =
    newAttrs.context != null
      ? `${newAttrs.context}_${newAttrs.text}`
      : newAttrs.text;
  const newKey = {
    id,
    context: newAttrs.context || null,
    text: newAttrs.text,
    firstUsed: newAttrs.firstUsed,
    unusedSince: newAttrs.unusedSince || null,
    sources: [],
  };
  _keys[id] = newKey;
  saveKeys();
  debouncedCompileTranslations();
  publish('createdKey', { key: newKey });
  updateStats();
  return newKey;
}

async function updateKey(id: string, newAttrs: Object): Promise<?InternalKeyT> {
  const updatedKey = merge(_keys[id], newAttrs);
  _keys[id] = updatedKey;
  saveKeys();
  debouncedCompileTranslations();
  await delay(RESPONSE_DELAY);
  publish('updatedKey', { key: updatedKey });
  updateStats();
  return updatedKey;
}

function getScopeList() {
  const ids = Object.keys(_keys);
  const scopes = {};
  for (let i = 0; i < ids.length; i++) {
    const { scope } = _keys[ids[i]];
    if (scope != null) scopes[scope] = true;
  }
  return Object.keys(scopes);
}

// ==============================================
// Parsing and delta-parsing
// ==============================================
async function parseSrcFiles({ story }: { story: StoryT }) {
  const { srcPaths, srcExtensions, msgFunctionNames, msgRegexps } = _config;
  const curKeys = parseAll({
    srcPaths,
    srcExtensions,
    msgFunctionNames,
    msgRegexps,
    localeDir: _localeDir,
    story,
  });
  const now = new Date().toISOString();

  // Go through the previous list of keys and:
  // - If key is still used, copy `firstUsed` attr from the previous list
  // - If key is no longer used, copy the whole key and initialise (if needed) `unusedSince`
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

  // Go through the new list of keys and initialise (if needed) `firstUsed`
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
  debouncedCompileTranslations({ story });
  updateStats();
  publish('parsedSrcFiles');

  // Try to add automatic translations
  story.info('db', 'Fetching auto translations...');
  newKeys.forEach(keyId => {
    fetchAutomaticTranslationsForKey(keyId, { story });
  });

  return _keys;
}

async function onSrcFileDeleted(
  filePath: string,
  { save }: { save: boolean } = {}
) {
  let hasChanged = false;
  const now = new Date().toISOString();
  const keyIds = Object.keys(_keys);
  for (let i = 0; i < keyIds.length; i++) {
    const key = _keys[keyIds[i]];
    if (key.sources && key.sources.indexOf(filePath) >= 0) {
      key.sources = key.sources.filter(o => o !== filePath);
      hasChanged = true;
      if (!key.sources.length) key.unusedSince = now;
    }
  }
  if (hasChanged && save) {
    saveKeys();
    debouncedCompileTranslations();
    updateStats();
    publish('parsedSrcFiles');
  }
}

async function onSrcFileAdded(
  filePath: string,
  { save, forceSave }: { save: boolean, forceSave?: boolean } = {}
) {
  let hasChanged = false;
  const now = new Date().toISOString();
  const { msgFunctionNames, msgRegexps } = _config;
  const newKeys = parseOne({
    filePath,
    msgFunctionNames,
    msgRegexps,
    story: mainStory,
  });
  const newKeyIds = Object.keys(newKeys);
  for (let i = 0; i < newKeyIds.length; i++) {
    hasChanged = true;
    const newKeyId = newKeyIds[i];
    const newKey = newKeys[newKeyId];
    if (_keys[newKeyId]) {
      _keys[newKeyId].sources.push(filePath);
      _keys[newKeyId].unusedSince = null; // just in case
    } else {
      _keys[newKeyId] = newKey;
      _keys[newKeyId].firstUsed = now;
    }
  }
  if ((hasChanged && save) || forceSave) {
    saveKeys();
    debouncedCompileTranslations();
    updateStats();
    publish('parsedSrcFiles');
  }

  // Try to add automatic translations
  mainStory.info('db', 'Fetching auto translations...');
  newKeyIds.forEach(keyId => {
    fetchAutomaticTranslationsForKey(keyId, { story: mainStory });
  });
}

function fetchAutomaticTranslationsForKey(
  keyId: string,
  { story }: { story: StoryT }
) {
  const key = _keys[keyId];
  const { text } = key;

  // Abort if message has MessageFormat tags (cannot be auto-translated
  // reliably)
  if (text.indexOf('{') >= 0) return;
  _config.langs.forEach(async lang => {
    if (lang.startsWith(_config.originalLang)) return;
    if (getKeyTranslations(keyId, lang).length) return;
    const translation = await getAutoTranslation(text, lang);
    if (translation != null) {
      createTranslation({ lang, translation, fuzzy: true, keyId }, { story });
    }
  });
}

// ==============================================
// Translations
// ==============================================
let _translations: MapOf<InternalTranslationT> = {};

const getLangPath = (lang: string): string =>
  path.join(_localeDir, `${lang}.json`);
const getCompiledLangPath = (lang: string, scope: ?string): string =>
  scope != null
    ? path.join(_localeDir, 'scoped', `${scope}-${lang}.js`)
    : path.join(_localeDir, `${lang}.js`);
const getJsonLangPath = (lang: string): string =>
  path.join(_localeDir, `${lang}.out.json`);
const getReactIntlLangPath = (lang: string): string =>
  path.join(_localeDir, `${lang}.reactIntl.json`);
function setTranslations(translations: MapOf<InternalTranslationT>) {
  _translations = translations;
}

function initTranslations() {
  _config.langs.forEach(lang => {
    const langPath = getLangPath(lang);
    try {
      fs.statSync(langPath);
    } catch (err) {
      saveJson(langPath, {});
    } finally {
      mainStory.info('db', `Reading file ${chalk.cyan.bold(langPath)}...`);
      readTranslations(lang);
    }
  });
}

function readTranslations(lang: string) {
  const translations = readJson(getLangPath(lang));
  if (translations) {
    _translations = merge(_translations, translations);
  }
}

function readAllTranslationsFromAnotherDir(dir: string) {
  let out = {};
  _config.langs.forEach(lang => {
    try {
      out = merge(out, readJson(path.join(dir, `${lang}.json`)));
    } catch (err) {
      /* swallow: we ignore langs for which there are no translations */
    }
  });
  return out;
}

function saveTranslations(lang: string, options: Object) {
  const langTranslations = {};
  Object.keys(_translations).forEach(translationId => {
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

function getLangTranslations(
  lang: string,
  refTranslations?: MapOf<InternalTranslationT> = _translations
): Array<InternalTranslationT> {
  const out = [];
  Object.keys(refTranslations).forEach(translationId => {
    const translation = refTranslations[translationId];
    if (!translation.isDeleted && translation.lang === lang) {
      out.push(translation);
    }
  });
  return out;
}

function getKeyTranslations(
  keyId: string,
  lang?: string
): Array<InternalTranslationT> {
  const out = [];
  Object.keys(_translations).forEach(translationId => {
    const translation = _translations[translationId];
    if (translation.isDeleted) return;
    if (lang && translation.lang !== lang) return;
    if (translation.keyId !== keyId) return;
    out.push(translation);
  });
  return out;
}

function getTranslation(id: string): ?InternalTranslationT {
  return _translations[id];
}

async function createTranslation(
  newAttrs: Object,
  { story }: { story: StoryT }
): Promise<?InternalTranslationT> {
  const { lang, translation, fuzzy, keyId } = newAttrs;
  if (!lang) throw new Error('Translation language must be specified');
  if (keyId == null) throw new Error('Translation key must be specified');
  const id = uuid.v4();
  const newTranslation = {
    id,
    isDeleted: false,
    lang,
    translation,
    fuzzy,
    keyId,
  };
  _translations[id] = newTranslation;
  saveTranslations(lang, { story });
  debouncedCompileTranslations({ story });
  await delay(RESPONSE_DELAY);
  publish('createdTranslation', { translation: newTranslation });
  updateStats();
  return newTranslation;
}

async function updateTranslation(
  id: string,
  newAttrs: Object,
  { story }: { story: StoryT }
): Promise<?InternalTranslationT> {
  const updatedTranslation = merge(_translations[id], newAttrs);
  _translations[id] = updatedTranslation;
  saveTranslations(updatedTranslation.lang, { story });
  debouncedCompileTranslations({ story });
  await delay(RESPONSE_DELAY);
  publish('updatedTranslation', { translation: updatedTranslation });
  updateStats();
  return updatedTranslation;
}

// ==============================================
// Compiling translations
// ==============================================
function compileTranslations({ story: baseStory }: { story?: StoryT } = {}) {
  const story = (baseStory || mainStory).child({
    src: 'db',
    title: 'Compile translations',
  });

  // ---------------------------------
  // Gather all keys (incl. otherLocaleDirs)
  // ---------------------------------
  story.info('db', 'Gathering keys...');
  const keys = {};
  const loadKeys = myKeys => {
    Object.keys(myKeys).forEach(name => {
      const key = myKeys[name];
      if (!key.isDeleted) keys[name] = key;
    });
  };
  _otherLocaleDirs.forEach(dir => {
    const otherKeys = readJson(path.join(dir, 'keys.json'));
    loadKeys(otherKeys);
  });
  loadKeys(_keys);

  const { fMinify } = _config;
  try {
    // ---------------------------------
    // Gather all translations (incl. otherLocaleDirs)
    // ---------------------------------
    story.info('db', 'Gathering translations...');
    const allTranslations = {};
    const { langs } = _config;
    langs.forEach(lang => {
      allTranslations[lang] = [];
    });
    const loadTranslations = refTranslations => {
      const temp = getAllTranslations(langs, refTranslations);
      langs.forEach(lang => {
        allTranslations[lang] = allTranslations[lang].concat(temp[lang] || []);
      });
    };
    _otherLocaleDirs.forEach(dir => {
      const otherTranslations = readAllTranslationsFromAnotherDir(dir);
      loadTranslations(otherTranslations);
    });
    loadTranslations(_translations);

    // ---------------------------------
    // Generate all translations outputs
    // ---------------------------------
    Object.keys(allTranslations).forEach(lang => {
      const translations = allTranslations[lang];

      // ---------------------------------
      // Generate JS output
      // ---------------------------------
      if (_config.fJsOutput) {
        const scopes = [null].concat(getScopeList());
        scopes.forEach(scope => {
          const translationSubset = translations.filter(({ keyId }) => {
            const key = keys[keyId];
            if (!key) return false;
            if (key.scope == null) return scope == null;
            return key.scope === scope;
          });
          const compiledLangPath = getCompiledLangPath(lang, scope);
          fs.ensureDirSync(path.dirname(compiledLangPath));
          const fnTranslate = compile({
            lang,
            keys,
            translations: translationSubset,
            fAlwaysIncludeKeysWithBraces: scope == null,
            fMinify,
            story,
          });
          story.debug(
            'db',
            `Writing file ${chalk.cyan.bold(compiledLangPath)}...`
          );
          fs.writeFileSync(compiledLangPath, fnTranslate, 'utf8');
        });
      }

      // ---------------------------------
      // Generate ReactIntl outputs
      // ---------------------------------
      if (_config.fReactIntlOutput) {
        const reactIntlLangPath = getReactIntlLangPath(lang);
        const reactIntlTranslations = collectReactIntlTranslations({
          lang,
          keys,
          translations,
          story,
        });
        saveJson(reactIntlLangPath, reactIntlTranslations, { story });
      }

      // ---------------------------------
      // Generate JSON outputs
      // ---------------------------------
      if (_config.fJsonOutput) {
        const jsonLangPath = getJsonLangPath(lang);
        const jsonTranslations = collectJsonTranslations({
          lang,
          keys,
          translations,
          story,
        });
        saveJson(jsonLangPath, jsonTranslations, { story });
      }
    });
    if (_onChange) _onChange();
  } catch (err) {
    story.error('db', 'Could not compile translations:', { attach: err });
  } finally {
    story.close();
  }
}
const debouncedCompileTranslations = UNIT_TESTING
  ? compileTranslations
  : debounce(compileTranslations, DEBOUNCE_COMPILE);

function getAllTranslations(
  langs: Array<string>,
  refTranslations: MapOf<InternalTranslationT>
): MapOf<Array<InternalTranslationT>> {
  // Determine lang structure
  const langStructure = {};
  const sortedLangs = langs.slice().sort();
  sortedLangs.forEach(lang => {
    langStructure[lang] = { parent: null, children: [] };
    const tokens = lang.split(/[_-]/);
    for (let i = 0; i < tokens.length; i++) {
      const tmpLang = tokens.slice(0, i + 1).join('-');
      if (!langStructure[tmpLang]) {
        langStructure[tmpLang] = { parent: null, children: [] };
      }
      if (i > 0) {
        const parentLang = tokens.slice(0, i).join('-');
        langStructure[parentLang].children.push(tmpLang);
        langStructure[tmpLang].parent = parentLang;
      }
    }
  });
  // story.debug('db', 'Language tree', { attach: langStructure });

  // Collect all translations for languages, from top to bottom:
  // - Add all children translations (backup)
  // - Add ancestor translations (including those coming up from other branches)
  // - Add own translations
  // This algorithm may result in multiple translations for the same key, but the latest one
  // should have higher priority (this is used by `debouncedCompileTranslations()` during flattening).
  // Higher priority is guaranteed by the order in which languages are processed,
  // and the order in which translations are added to the array.
  const allLangs = Object.keys(langStructure).sort();
  allLangs.forEach(lang => {
    const childrenTranslations = getChildrenTranslations(
      langStructure,
      lang,
      refTranslations,
      []
    );
    // story.debug('db', `Children translations for ${lang}`, { attach: childrenTranslations });
    const parentTranslations = getParentTranslations(langStructure, lang);
    // story.debug('db', `Parent translations for ${lang}`, { attach: parentTranslations });
    const ownTranslations = getLangTranslations(lang, refTranslations);
    // story.debug('db', `Own translations for ${lang}`, { attach: ownTranslations });
    langStructure[lang].translations = childrenTranslations.concat(
      parentTranslations,
      ownTranslations
    );
  });

  // Replace lang structure by the translations themselves
  const out = {};
  Object.keys(langStructure).forEach(lang => {
    out[lang] = langStructure[lang].translations;
  });
  // story.debug('db', 'All translations', { attach: out });
  return out;
}

// Recursive
function getChildrenTranslations(
  langStructure: MapOf<Object>,
  lang: string,
  refTranslations: MapOf<InternalTranslationT>,
  translations0: Array<InternalTranslationT>
): Array<InternalTranslationT> {
  let translations = translations0;
  langStructure[lang].children.forEach(childLang => {
    translations = translations.concat(
      getLangTranslations(childLang, refTranslations)
    );
    translations = getChildrenTranslations(
      langStructure,
      childLang,
      refTranslations,
      translations
    );
  });
  return translations;
}

function getParentTranslations(
  langStructure: MapOf<Object>,
  lang: string
): Array<InternalTranslationT> {
  let out = [];
  const tokens = lang.split(/[_-]/);
  if (tokens.length < 1) return out;
  for (let i = 0; i < tokens.length - 1; i++) {
    const tmpLang = tokens.slice(0, i + 1).join('-');
    out = out.concat(langStructure[tmpLang].translations);
  }
  return out;
}

// ==============================================
// Auto translations
// ==============================================
let _autoTranslationsPath: string;
let _autoTranslations: MapOf<string> = {}; // cache, saved to file

function initAutoTranslations() {
  _autoTranslationsPath = path.join(_localeDir, 'autoTranslations.json');
  try {
    fs.statSync(_autoTranslationsPath);
  } catch (err) {
    saveAutoTranslations();
  } finally {
    mainStory.info(
      'db',
      `Reading file ${chalk.cyan.bold(_autoTranslationsPath)}...`
    );
    readGoogleCache();
  }
}

function readGoogleCache() {
  _autoTranslations = readJson(_autoTranslationsPath);
}

function saveAutoTranslations(options?: Object) {
  saveJson(_autoTranslationsPath, _autoTranslations, options);
}
const debouncedSaveAutoTranslations = UNIT_TESTING
  ? saveAutoTranslations
  : debounce(saveAutoTranslations, DEBOUNCE_SAVE);

async function getAutoTranslation(text: string, lang: string) {
  const cacheKey = `${lang}:::::${text}`;
  let translation = _autoTranslations[cacheKey];
  if (translation) return translation;
  translation = await autoTranslate(text, {
    languageCodeTo: lang,
  });
  if (translation == null) return translation;
  _autoTranslations[cacheKey] = translation;
  debouncedSaveAutoTranslations();
  return translation;
}

// ==============================================
// Stats
// ==============================================
let _stats: InternalStatsT;

function initStats() {
  calcStats();
  mainStory.info('db', 'Initial stats', { attach: _stats });
}

function updateStats() {
  calcStats();
  publish('updatedStats', { stats: _stats });
}

function calcStats() {
  _stats = {
    numTotalKeys: 0,
    numUsedKeys: 0,
    numTranslations: [],
  };

  // Process keys
  const keys = getKeys(); // filters out deleted ones
  for (let i = 0; i < keys.length; i++) {
    _stats.numTotalKeys += 1;
    if (keys[i].unusedSince == null) _stats.numUsedKeys += 1;
  }

  // Process translations
  const { langs } = getConfig();
  for (let i = 0; i < langs.length; i++) {
    const lang = langs[i];
    const translations = getLangTranslations(lang).filter(
      translation =>
        _keys[translation.keyId] != null && !_keys[translation.keyId].isDeleted
    );
    _stats.numTranslations.push({
      lang,
      value: translations.length,
    });
  }
}

function getStats() {
  return _stats;
}

// ==============================================
// Merge keys and translations from old stores
// ==============================================
function importV0(dir: string) {
  const story = mainStory.child({ src: 'db', title: 'Import v0' });
  const { langs, keys, translations } = importers.importV0({
    langs: _config.langs,
    keys: _keys,
    translations: _translations,
    dir,
    story,
  });
  if (langs !== _config.langs) updateConfig({ langs }, { story });
  if (keys !== _keys) {
    _keys = keys;
    saveKeys({ story });
  }
  if (translations !== _translations) {
    _translations = translations;
    _config.langs.forEach(lang => {
      saveTranslations(lang, { story });
    });
  }
  debouncedCompileTranslations();
  story.close();
}

function migrateDatabase(prevDbVersion: number) {
  const story = mainStory.child({
    src: 'db',
    title: `Upgrade DB ${prevDbVersion} -> ${DB_VERSION}`,
  });
  if (prevDbVersion == null || prevDbVersion < 2) {
    importers.importToV2({ langs: _config.langs, dir: _localeDir, story });
  }
  story.close();
}

// ==============================================
// Helpers
// ==============================================
function readJson(filePath: string): any {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

function saveJson(
  filePath: string,
  obj: any,
  { story = mainStory }: { story?: StoryT } = {}
) {
  story.debug('db', `Writing file ${chalk.cyan.bold(filePath)}...`);
  fs.writeFileSync(filePath, JSON.stringify(obj, null, '  '), 'utf8');
}

// ==============================================
// Public
// ==============================================
export {
  init,
  getConfig,
  updateConfig,
  getKeys,
  getKey,
  createKey,
  updateKey,
  getTranslations,
  getLangTranslations,
  getKeyTranslations,
  getTranslation,
  createTranslation,
  updateTranslation,
  getStats,
  parseSrcFiles,
  debouncedCompileTranslations,
  getAutoTranslation,
  importV0,
  saveJson,
  // Only for unit tests
  DEFAULT_CONFIG as _DEFAULT_CONFIG,
  setLocaleDir as _setLocaleDir,
  setKeyPath as _setKeyPath,
  setConfigPath as _setConfigPath,
  setConfig as _setConfig,
  setKeys as _setKeys,
  setTranslations as _setTranslations,
};
