import { utf8ToBase64 } from './common/base64';

let _locales = {};
const keyCache = {};

const translate = (locales, utf8, data) => {
  let base64 = keyCache[utf8];
  if (base64 == null) base64 = keyCache[utf8] = utf8ToBase64(utf8);
  const fnTranslate = locales[base64];
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

const _t = (key, data) => translate(_locales, key, data);

_t.setLocales = locales => { _locales = locales; };
_t.getParentBcp47 = bcp47 => {
  const tokens = bcp47.replace(/_/g, '-').split('-');
  if (tokens.length <= 1) return null;
  return tokens.slice(0, tokens.length - 1).join('-');
};

module.exports = _t;
