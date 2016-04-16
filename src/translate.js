let _locales = {};

function translate(locales, key, data) {
  const fnTranslate = locales[key];
  let out;
  if (fnTranslate) {
    out = fnTranslate(data);
  } else {
    out = key;
    const contextSeparatorIndex = out.indexOf('_');
    if (contextSeparatorIndex >= 0) {
      out = out.substring(contextSeparatorIndex + 1, out.length);
    }
  }
  out = out.trim();
  return out;
}

function _t(key, data) { return translate(_locales, key, data); }

_t.setLocales = function setLocales(locales) { _locales = locales; };

module.exports = _t;
