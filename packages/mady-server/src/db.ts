import path from 'path';
import fs from 'fs-extra';
import slash from 'slash';
import { addDefaults, merge } from 'timm';
import { mainStory, chalk } from 'storyboard';
import { decode } from 'js-base64';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash/debounce';
import type { Config, Key, Keys, Translation, Translations } from './types';
import { init as initFileWatcher } from './fileWatcher';
import { parseAll, parseOne } from './parseSources';
import compile from './compileTranslations';
import collectJsonTranslations from './collectJsonTranslations';
import autoTranslate from './autoTranslate';

const SRC = 'mady-db';
const JSON_OPTIONS = { spaces: 2 };
const DEBOUNCE_SAVE = 2000;
const DEBOUNCE_COMPILE = 2000;
const { UNIT_TESTING } = process.env;
const DEFAULT_CONFIG: Config = {
  srcPaths: ['src'],
  srcExtensions: ['.js', '.jsx', '.ts', '.tsx'],
  langs: ['en'],
  originalLang: 'en',
  msgFunctionNames: ['_t'],
  msgRegexps: [],
  fMinify: false,
  fJsOutput: true,
  fJsonOutput: false,
};

// ==============================================
// Declarations
// ==============================================
let _localeDir: string;
let _otherLocaleDirs: string[] = [];
let _autoTranslateNewKeys: boolean;
let _onChange: Function | null | undefined;
let _configPath: string;
let _config: Config = DEFAULT_CONFIG;
let _keyPath: string;
let _keys: Keys = {};

type Options = {
  localeDir: string;
  otherLocaleDirs?: string[];
  watch?: boolean;
  autoTranslateNewKeys?: boolean;
  onChange?: Function;
};

// ==============================================
// Init
// ==============================================
const init = (options: Options) => {
  _localeDir = options.localeDir;
  _otherLocaleDirs = options.otherLocaleDirs || [];
  _autoTranslateNewKeys = !!options.autoTranslateNewKeys;
  _onChange = options.onChange;
  fs.ensureDirSync(_localeDir);
  initConfig();
  initKeys();
  initAutoTranslations();
  initTranslations();
  if (options.watch)
    initFileWatcher({ paths: _config.srcPaths, onEvent: onFileChange });
};

const _setLocaleDir = (localeDir: string) => {
  _localeDir = localeDir;
};

const onFileChange = async (eventType: string, filePath0: string) => {
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

// ==============================================
// Config
// ==============================================
const _setConfigPath = (configPath: string) => {
  _configPath = configPath;
};

const getConfig = () => _config;
const _setConfig = (config: Config) => {
  _config = config;
};

const initConfig = () => {
  _configPath = path.join(_localeDir, 'config.json');
  mainStory.info(SRC, `Reading file ${chalk.cyan.bold(_configPath)}...`);
  let hasChanged = false;
  if (fs.pathExistsSync(_configPath)) {
    const config = fs.readJsonSync(_configPath);
    _config = addDefaults(config, DEFAULT_CONFIG);
    if (_config !== config) hasChanged = true;
  } else {
    hasChanged = true;
  }
  if (hasChanged) fs.writeJsonSync(_configPath, _config, JSON_OPTIONS);
};

// ==============================================
// Keys
// ==============================================
const _setKeyPath = (keyPath: string) => {
  _keyPath = keyPath;
};

const getKeys = () => Object.values(_keys).filter((o) => !o.isDeleted);
const getKey = (id: string) => _keys[id];
const _setKeys = (keys: Keys) => {
  _keys = keys;
};

const initKeys = () => {
  _keyPath = path.join(_localeDir, 'keys.json');
  mainStory.info(SRC, `Reading file ${chalk.cyan.bold(_keyPath)}...`);
  if (fs.pathExistsSync(_keyPath)) {
    _keys = fs.readJsonSync(_keyPath);
  } else {
    saveKeys();
  }
};

const saveKeys = () => {
  mainStory.debug(SRC, `Writing ${chalk.cyan.bold(_keyPath)}...`);
  fs.writeJsonSync(_keyPath, _keys, JSON_OPTIONS);
};

const createKey = async (newAttrs: Partial<Key>) => {
  const text = newAttrs.text as string;
  const id =
    newAttrs.context != null ? `${newAttrs.context}_${text}` : (text as string);
  const newKey = {
    id,
    context: newAttrs.context,
    text,
    firstUsed: newAttrs.firstUsed,
    unusedSince: newAttrs.unusedSince || null,
    sources: [],
  };
  _keys[id] = newKey;
  saveKeys();
  debouncedCompileTranslations();
  return newKey;
};

const updateKey = async (id: string, newAttrs: Partial<Key>) => {
  const updatedKey = merge(_keys[id], newAttrs);
  _keys[id] = updatedKey as Key;
  saveKeys();
  debouncedCompileTranslations();
  return updatedKey;
};

// List all scopes being used in keys
const getScopeList = () => {
  const scopes: Record<string, boolean> = {};
  Object.keys(_keys).forEach((id) => {
    const { scope } = _keys[id];
    if (scope != null) scopes[scope] = true;
  });
  return Object.keys(scopes);
};

// ==============================================
// Parsing and delta-parsing
// ==============================================
const parseSrcFiles = async () => {
  const { srcPaths, srcExtensions, msgFunctionNames, msgRegexps } = _config;
  const curKeys = parseAll({
    srcPaths,
    srcExtensions,
    msgFunctionNames,
    msgRegexps,
    localeDir: _localeDir,
  });
  const now = new Date().toISOString();

  // Go through the previous list of keys and:
  // - If key is still used, copy `firstUsed` attr from the previous list
  // - If key is no longer used, copy the whole key and initialise (if needed) `unusedSince`
  const unusedKeys: string[] = [];
  Object.keys(_keys).forEach((id) => {
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
    mainStory.debug(SRC, `${chalk.bold('Unused')} keys: ${unusedKeys.length}`, {
      attach: unusedKeys.map(decode),
    });
  }

  // Go through the new list of keys and initialise (if needed) `firstUsed`
  const newKeys: string[] = [];
  Object.keys(curKeys).forEach((id) => {
    const key = curKeys[id];
    if (!key.firstUsed) {
      newKeys.push(id);
      key.firstUsed = now;
    }
    _keys[id] = key;
  });
  if (newKeys.length) {
    mainStory.debug(SRC, `${chalk.bold('New')} keys: ${newKeys.length}`, {
      attach: newKeys.map(decode),
    });
  }

  saveKeys();
  debouncedCompileTranslations();

  // Try to add automatic translations
  if (_autoTranslateNewKeys) {
    mainStory.info(SRC, 'Fetching auto translations...');
    newKeys.forEach(fetchAutomaticTranslationsForKey);
  }

  return Object.values(_keys);
};

const onSrcFileDeleted = async (
  filePath: string,
  { save }: { save?: boolean } = {}
) => {
  let hasChanged = false;
  const now = new Date().toISOString();
  const keyIds = Object.keys(_keys);
  for (let i = 0; i < keyIds.length; i++) {
    const key = _keys[keyIds[i]];
    if (key.sources && key.sources.indexOf(filePath) >= 0) {
      key.sources = key.sources.filter((o) => o !== filePath);
      hasChanged = true;
      if (!key.sources.length) key.unusedSince = now;
    }
  }
  if (hasChanged && save) {
    saveKeys();
    debouncedCompileTranslations();
  }
};

const onSrcFileAdded = async (
  filePath: string,
  { save, forceSave }: { save?: boolean; forceSave?: boolean } = {}
) => {
  let hasChanged = false;
  const now = new Date().toISOString();
  const { msgFunctionNames, msgRegexps } = _config;
  const newKeys = parseOne({ filePath, msgFunctionNames, msgRegexps });
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
  }

  // Try to add automatic translations
  if (_autoTranslateNewKeys) {
    mainStory.info(SRC, 'Fetching auto translations...');
    newKeyIds.forEach(fetchAutomaticTranslationsForKey);
  }
};

const fetchAutomaticTranslationsForKey = (keyId: string) => {
  const key = _keys[keyId];
  const { text } = key;

  // Abort if message has MessageFormat tags (cannot be auto-translated
  // reliably)
  if (text.indexOf('{') >= 0) return;
  _config.langs.forEach(async (lang) => {
    if (lang.startsWith(_config.originalLang)) return;
    if (getKeyTranslations(keyId, lang).length) return;
    const translation = await getAutoTranslation(text, lang);
    if (translation != null) {
      createTranslation({ lang, translation, fuzzy: true, keyId });
    }
  });
};

// ==============================================
// Translations
// ==============================================
let _translations: Translations = {};

const getLangPath = (lang: string) => path.join(_localeDir, `${lang}.json`);
const getCompiledLangPath = (lang: string, scope: string | null): string =>
  scope != null
    ? path.join(_localeDir, 'scoped', `${scope}-${lang}.js`)
    : path.join(_localeDir, `${lang}.js`);
const getJsonLangPath = (lang: string) =>
  path.join(_localeDir, `${lang}.out.json`);
const setTranslations = (translations: Translations) => {
  _translations = translations;
};

const initTranslations = () => {
  _config.langs.forEach((lang) => {
    const langPath = getLangPath(lang);
    try {
      fs.statSync(langPath);
    } catch (err) {
      fs.writeJsonSync(langPath, {}, JSON_OPTIONS);
    } finally {
      mainStory.info(SRC, `Reading file ${chalk.cyan.bold(langPath)}...`);
      readTranslations(lang);
    }
  });
};

const readTranslations = (lang: string) => {
  const translations = fs.readJsonSync(getLangPath(lang));
  if (translations) _translations = merge(_translations, translations);
};

const readAllTranslationsFromAnotherDir = (dir: string) => {
  let out = {};
  _config.langs.forEach((lang) => {
    try {
      out = merge(out, fs.readJsonSync(path.join(dir, `${lang}.json`)));
    } catch (err) {
      /* swallow: we ignore langs for which there are no translations */
    }
  });
  return out;
};

const saveTranslations = (lang: string) => {
  const langTranslations: Translations = {};
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (translation.lang === lang) {
      langTranslations[translation.id] = translation;
    }
  });
  const langPath = getLangPath(lang);
  mainStory.debug(SRC, `Writing ${chalk.cyan.bold(langPath)}...`);
  fs.writeJsonSync(langPath, langTranslations, JSON_OPTIONS);
};

const getTranslations = () => Object.values(_translations);

const getLangTranslations = (
  lang: string,
  refTranslations: Translations = _translations
) => {
  const out: Translation[] = [];
  Object.keys(refTranslations).forEach((translationId) => {
    const translation = refTranslations[translationId];
    if (!translation.isDeleted && translation.lang === lang) {
      out.push(translation);
    }
  });
  return out;
};

const getKeyTranslations = (keyId: string, lang?: string) => {
  const out: Translation[] = [];
  Object.keys(_translations).forEach((translationId) => {
    const translation = _translations[translationId];
    if (translation.isDeleted) return;
    if (lang && translation.lang !== lang) return;
    if (translation.keyId !== keyId) return;
    out.push(translation);
  });
  return out;
};

const getTranslation = (id: string) => _translations[id];

const createTranslation = async (newAttrs: Partial<Translation>) => {
  const { lang, translation, fuzzy, keyId } = newAttrs;
  if (!lang) throw new Error('Translation language must be specified');
  if (keyId == null) throw new Error('Translation key must be specified');
  const id = uuidv4();
  const newTranslation = {
    id,
    isDeleted: false,
    lang,
    translation,
    fuzzy,
    keyId,
  } as Translation;
  _translations[id] = newTranslation;
  saveTranslations(lang);
  debouncedCompileTranslations();
  return newTranslation;
};

const updateTranslation = async (id: string, newAttrs: Object) => {
  const updatedTranslation = merge(_translations[id], newAttrs);
  _translations[id] = updatedTranslation;
  saveTranslations(updatedTranslation.lang);
  debouncedCompileTranslations();
  return updatedTranslation;
};

// ==============================================
// Compiling translations
// ==============================================
const compileTranslations = async () => {
  mainStory.info(SRC, 'Compiling translations...');

  // Gather all keys (incl. otherLocaleDirs)
  mainStory.debug(SRC, 'Gathering keys...');
  const keys: Keys = {};
  const loadKeys = (myKeys: Keys) => {
    Object.keys(myKeys).forEach((name) => {
      const key = myKeys[name];
      if (!key.isDeleted) keys[name] = key;
    });
  };
  _otherLocaleDirs.forEach((dir) => {
    const otherKeys = fs.readJsonSync(path.join(dir, 'keys.json'));
    loadKeys(otherKeys);
  });
  loadKeys(_keys);

  const { fMinify } = _config;
  try {
    // Gather all translations (incl. otherLocaleDirs)
    mainStory.debug(SRC, 'Gathering translations...');
    const allTranslations: Record<string, Translation[]> = {};
    const { langs } = _config;
    langs.forEach((lang) => {
      allTranslations[lang] = [];
    });
    const loadTranslations = (refTranslations: Translations) => {
      const temp = getAllTranslations(langs, refTranslations);
      langs.forEach((lang) => {
        allTranslations[lang] = allTranslations[lang].concat(temp[lang] || []);
      });
    };
    _otherLocaleDirs.forEach((dir) => {
      const otherTranslations = readAllTranslationsFromAnotherDir(dir);
      loadTranslations(otherTranslations);
    });
    loadTranslations(_translations);

    // Generate all translations outputs
    const allLangs = Object.keys(allTranslations);
    for (let i = 0; i < allLangs.length; i++) {
      const lang = allLangs[i];
      const translations = allTranslations[lang];

      // Generate JS output
      if (_config.fJsOutput) {
        const scopes = ([null] as Array<string | null>).concat(getScopeList());
        for (let k = 0; k < scopes.length; k++) {
          const scope = scopes[k];
          const translationSubset = translations.filter(({ keyId }) => {
            const key = keys[keyId];
            if (!key) return false;
            if (key.scope == null) return scope == null;
            return key.scope === scope;
          });
          console.log(`${lang} - ${scope}`);
          console.log(translationSubset.map((o) => o.translation));
          // TODO: consider adding scoped translations with braces to the corresponding scoped js
          const compiledLangPath = getCompiledLangPath(lang, scope);
          fs.ensureDirSync(path.dirname(compiledLangPath));
          const fnTranslate = await compile({
            lang,
            keys,
            translations: translationSubset,
            fAlwaysIncludeKeysWithBraces: scope == null,
            fMinify,
          });
          mainStory.debug(
            SRC,
            `Writing ${chalk.cyan.bold(compiledLangPath)}...`
          );
          fs.writeFileSync(compiledLangPath, fnTranslate, 'utf8');
        }
      }

      // Generate JSON outputs
      if (_config.fJsonOutput) {
        const jsonLangPath = getJsonLangPath(lang);
        const jsonTranslations = collectJsonTranslations({
          lang,
          keys,
          translations,
        });
        fs.writeJsonSync(jsonLangPath, jsonTranslations, JSON_OPTIONS);
      }
    }
    if (_onChange) _onChange();
  } catch (err) {
    mainStory.error(SRC, 'Could not compile translations:', { attach: err });
  }

  mainStory.info(SRC, 'Compiling done');
};

const debouncedCompileTranslations = UNIT_TESTING
  ? compileTranslations
  : debounce(compileTranslations, DEBOUNCE_COMPILE);

type LangNode = {
  parent: string | null;
  children: string[];
  translations: Translation[];
};
type LangStructure = Record<string, LangNode>;

const getAllTranslations = (langs: string[], refTranslations: Translations) => {
  // Determine lang structure
  const langStructure: LangStructure = {};
  const sortedLangs = langs.slice().sort();
  sortedLangs.forEach((lang) => {
    langStructure[lang] = { parent: null, children: [], translations: [] };
    const tokens = lang.split(/[_-]/);
    for (let i = 0; i < tokens.length; i++) {
      const tmpLang = tokens.slice(0, i + 1).join('-');
      if (!langStructure[tmpLang]) {
        langStructure[tmpLang] = {
          parent: null,
          children: [],
          translations: [],
        };
      }
      if (i > 0) {
        const parentLang = tokens.slice(0, i).join('-');
        langStructure[parentLang].children.push(tmpLang);
        langStructure[tmpLang].parent = parentLang;
      }
    }
  });
  // story.debug(SRC, 'Language tree', { attach: langStructure });

  // Collect all translations for languages, from top to bottom:
  // - Add all children translations (backup)
  // - Add ancestor translations (including those coming up from other branches)
  // - Add own translations
  // This algorithm may result in multiple translations for the same key, but the latest one
  // should have higher priority (this is used by `debouncedCompileTranslations()` during flattening).
  // Higher priority is guaranteed by the order in which languages are processed,
  // and the order in which translations are added to the array.
  const allLangs = Object.keys(langStructure).sort();
  allLangs.forEach((lang) => {
    const childrenTranslations = getChildrenTranslations(
      langStructure,
      lang,
      refTranslations,
      []
    );
    // story.debug(SRC, `Children translations for ${lang}`, { attach: childrenTranslations });
    const parentTranslations = getParentTranslations(langStructure, lang);
    // story.debug(SRC, `Parent translations for ${lang}`, { attach: parentTranslations });
    const ownTranslations = getLangTranslations(lang, refTranslations);
    // story.debug(SRC, `Own translations for ${lang}`, { attach: ownTranslations });
    langStructure[lang].translations = childrenTranslations.concat(
      parentTranslations,
      ownTranslations
    );
  });

  // Replace lang structure by the translations themselves
  const out: Record<string, Translation[]> = {};
  Object.keys(langStructure).forEach((lang) => {
    out[lang] = langStructure[lang].translations;
  });
  // story.debug(SRC, 'All translations', { attach: out });
  return out;
};

// Recursive
const getChildrenTranslations = (
  langStructure: LangStructure,
  lang: string,
  refTranslations: Translations,
  translations0: Translation[]
): Translation[] => {
  let translations = translations0;
  langStructure[lang].children.forEach((childLang) => {
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
};

const getParentTranslations = (langStructure: LangStructure, lang: string) => {
  let out: Translation[] = [];
  const tokens = lang.split(/[_-]/);
  if (tokens.length < 1) return out;
  for (let i = 0; i < tokens.length - 1; i++) {
    const tmpLang = tokens.slice(0, i + 1).join('-');
    out = out.concat(langStructure[tmpLang].translations);
  }
  return out;
};

// ==============================================
// Auto translations
// ==============================================
let _autoTranslationsPath: string;
let _autoTranslations: Record<string, string> = {}; // cache, saved to file

const initAutoTranslations = () => {
  _autoTranslationsPath = path.join(_localeDir, 'autoTranslations.json');
  try {
    fs.statSync(_autoTranslationsPath);
  } catch (err) {
    saveAutoTranslations();
  } finally {
    mainStory.info(
      SRC,
      `Reading file ${chalk.cyan.bold(_autoTranslationsPath)}...`
    );
    readGoogleCache();
  }
};

const readGoogleCache = () => {
  _autoTranslations = fs.readJsonSync(_autoTranslationsPath);
};

const saveAutoTranslations = () => {
  fs.writeJsonSync(_autoTranslationsPath, _autoTranslations, JSON_OPTIONS);
};
const debouncedSaveAutoTranslations = UNIT_TESTING
  ? saveAutoTranslations
  : debounce(saveAutoTranslations, DEBOUNCE_SAVE);

const getAutoTranslation = async (text: string, lang: string) => {
  const cacheKey = `${lang}:::::${text}`;
  let translation: string | null = _autoTranslations[cacheKey];
  if (translation) return translation;
  translation = await autoTranslate(text, { languageCodeTo: lang });
  if (translation == null) return null;
  _autoTranslations[cacheKey] = translation;
  debouncedSaveAutoTranslations();
  return translation;
};

// ==============================================
// Public
// ==============================================
export {
  init,
  getConfig,
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
  parseSrcFiles,
  compileTranslations,
  debouncedCompileTranslations,
  getAutoTranslation,
  // Only for unit tests
  DEFAULT_CONFIG as _DEFAULT_CONFIG,
  _setLocaleDir,
  _setKeyPath,
  _setConfigPath,
  _setConfig,
  _setKeys,
  setTranslations as _setTranslations,
};
