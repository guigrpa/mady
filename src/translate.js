/*!
 * Mady
 *
 * Easy-to-use tool to manage and translate ICU MessageFormat messages.
 *
 * @copyright Guillermo Grau Panea 2016
 * @license MIT
 */

// @flow

import { utf8ToBase64 } from './common/base64';
import type {
  MapOf,
  LocaleFunctionT,
} from './common/types';

type MapOfLocaleFunctionsT = MapOf<LocaleFunctionT>;
type MapOfStringsT = MapOf<string>;
type MapOfMapOfLocaleFunctionsT = MapOf<MapOfLocaleFunctionsT>;

// Current locales
let _locales: MapOfLocaleFunctionsT = {};

// Caches
const allLocales: MapOfMapOfLocaleFunctionsT = {};
const allLocaleCode: MapOfStringsT = {};
const keyCache: MapOfStringsT = {};

const translate = (utf8: string, data: ?Object): string => {
  let base64 = keyCache[utf8];
  if (base64 == null) base64 = keyCache[utf8] = utf8ToBase64(utf8);
  const fnTranslate = _locales[base64];
  let out;
  if (fnTranslate) {
    out = fnTranslate(data);
  } else {
    out = utf8;
    const contextSeparatorIndex = out.indexOf('_');
    if (contextSeparatorIndex >= 0) {
      out = out.substring(contextSeparatorIndex + 1, out.length);
    }
  }
  out = out.trim();
  return out;
};

const getLocaleOrLocaleCode = <T>(
  cache: MapOf<T>,
  initialLang: string
): { lang: ?string, result: ?T } => {
  let result = null;
  let lang = initialLang;
  while (!(result = cache[lang])) {
    lang = _t.getParentBcp47(lang);
    if (!lang) break;
  }
  return { lang, result };
};

const _t = translate;

_t.addLocales = (lang: string, locales: MapOfLocaleFunctionsT): void => {
  allLocales[lang] = locales;
};
_t.addLocaleCode = (lang: string, localeCode: string): void => {
  allLocaleCode[lang] = localeCode;
};

_t.setLocales = (langOrLocales: string | MapOfLocaleFunctionsT): ?string => {
  let out = null;
  if (typeof langOrLocales === 'string') {
    const { lang, result } = getLocaleOrLocaleCode(allLocales, langOrLocales);
    if (lang && result) _locales = result;
    out = lang;
  } else {
    _locales = langOrLocales;
  }
  return out;
};

_t.getLocales = (lang: string): { lang: ?string, result: ?MapOfLocaleFunctionsT } =>
  getLocaleOrLocaleCode(allLocales, lang);
_t.getLocaleCode = (lang: string): { lang: ?string, result: ?string } =>
  getLocaleOrLocaleCode(allLocaleCode, lang);

_t.getParentBcp47 = (bcp47: string): ?string => {
  const tokens = bcp47.replace(/_/g, '-').split('-');
  if (tokens.length <= 1) return null;
  return tokens.slice(0, tokens.length - 1).join('-');
};

// =======================================
// Public API
// =======================================
module.exports = _t;
