const data = {};

function cookieGet(key, options = {}) {
  let out;
  try {
    out = JSON.parse(data[key]);
  } catch (err) { /* ignore */ }
  if (out == null) out = options.defaultValue;
  return out;
}

function cookieSet(key, val) {
  try {
    data[key] = JSON.stringify(val);
  } catch (err) { /* ignore */ }
}

function __cookieUnset(key) {
  delete data[key];
}

module.exports = {
  cookieGet,
  cookieSet,
  __cookieUnset,
};
