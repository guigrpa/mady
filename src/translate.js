import { utf8ToBase64 } from './common/base64';

// Current locales
let _locales = {};

// Caches
const allLocales = {};
const keyCache = {};

const translate = (utf8, data) => {
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

const _t = translate;

_t.setLocales = langOrLocales => {
  if (typeof langOrLocales === 'string') {
    let lang = langOrLocales;
    let locales = null;
    while (!(locales = allLocales[lang])) {
      lang = _t.getParentBcp47(lang);
      if (!lang) return null;
    }
    _locales = locales;
    return lang;
  } else {
    _locales = langOrLocales;
    return null
  }
};

_t.addLocales = (lang, locales) => { allLocales[lang] = locales; };

_t.getParentBcp47 = bcp47 => {
  const tokens = bcp47.replace(/_/g, '-').split('-');
  if (tokens.length <= 1) return null;
  return tokens.slice(0, tokens.length - 1).join('-');
};

// =======================================
// Public API
// =======================================
module.exports = _t;
