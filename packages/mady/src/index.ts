/*!
 * Mady
 *
 * Easy-to-use tool to manage and translate ICU MessageFormat messages.
 *
 * @copyright Guillermo Grau Panea 2016-present
 * @license MIT
 */

import { encode } from 'js-base64';

// =======================================
// State
// =======================================
// Current locales
let _locales: Record<string, Function> = {};

// Caches
const allLocales: Record<string, Record<string, Function>> = {};
const allLocaleCode: Record<string, string> = {};
const keyCache: Record<string, string> = {};

// =======================================
// Main
// =======================================
const translate = (utf8: string, data?: any): string => {
  let base64 = keyCache[utf8];
  if (base64 == null) {
    base64 = encode(utf8);
    keyCache[utf8] = base64;
  }
  const fnTranslate = _locales[base64];
  let out;
  if (fnTranslate) {
    out = fnTranslate(data);
  } else {
    out = utf8;
    const idxContextSep = out.indexOf('_');
    if (idxContextSep >= 0) out = out.slice(idxContextSep + 1);
  }
  out = out.trim();
  return out;
};

// =======================================
// Extras
// =======================================
const getLocaleOrLocaleCode = <T>(
  cache: Record<string, T>,
  initialLang: string
): { lang: string | null; result: T | null } => {
  let result = null;
  let lang: string | null = initialLang;
  while (!(result = cache[lang])) {
    lang = getParentBcp47(lang);
    if (!lang) break;
  }
  return { lang, result };
};

const addLocales = (lang: string, locales: Record<string, Function>) => {
  allLocales[lang] = locales;
};
const addLocaleCode = (lang: string, localeCode: string) => {
  allLocaleCode[lang] = localeCode;
};

const setLocales = (
  langOrLocales: string | Record<string, Function>
): string | null => {
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

const getLocales = (lang: string) => getLocaleOrLocaleCode(allLocales, lang);
const getLocaleCode = (lang: string) =>
  getLocaleOrLocaleCode(allLocaleCode, lang);

const getParentBcp47 = (bcp47: string) => {
  const tokens = bcp47.replace(/_/g, '-').split('-');
  if (tokens.length <= 1) return null;
  return tokens.slice(0, tokens.length - 1).join('-');
};

// =======================================
// Public API
// =======================================
const _t: {
  (utf8: string, data?: any): string;
  addLocales: typeof addLocales;
  addLocaleCode: typeof addLocaleCode;
  setLocales: typeof setLocales;
  getLocales: typeof getLocales;
  getLocaleCode: typeof getLocaleCode;
  getParentBcp47: typeof getParentBcp47;
} = translate as any;
_t.addLocales = addLocales;
_t.addLocaleCode = addLocaleCode;
_t.setLocales = setLocales;
_t.getLocales = getLocales;
_t.getLocaleCode = getLocaleCode;
_t.getParentBcp47 = getParentBcp47;

export default _t;
