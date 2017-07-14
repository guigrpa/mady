const data = {};

function cookieGet(key, options = {}) {
  let out = data[key];
  if (out == null) out = options.defaultValue;
  return out;
}
function cookieSet(key, val) {
  data[key] = val;
}
function __cookieUnset(key) {
  delete data[key];
}

module.exports = {
  cookieGet,
  cookieSet,
  __cookieUnset,
};
