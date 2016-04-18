const Cookie = !process.env.SERVER_SIDE_RENDERING && require('tiny-cookie');
const NAMESPACE = 'mady';

function localGet(key, options = {}) {
  let out = options.defaultValue;
  try {
    out = JSON.parse(localStorage[`${NAMESPACE}_${key}`]);
  } catch (err) { /* ignore */ }
  return out;
}

function localSet(key, val) {
  try {
    localStorage[`${NAMESPACE}_${key}`] = JSON.stringify(val);
  } catch (err) { /* ignore */ }
}

// Note: tiny-cookie does not distinguish between undefined cookies
// and null-valued ones...
function cookieGet(key, options = {}) {
  let out;
  try {
    out = JSON.parse(Cookie.getRaw(`${NAMESPACE}_${key}`));
  } catch (err) { /* ignore */ }
  if (out == null) out = options.defaultValue;
  return out;
}

function cookieSet(key, val) {
  try {
    const cookieOptions = { expires: '5Y' };
    Cookie.setRaw(`${NAMESPACE}_${key}`, JSON.stringify(val), cookieOptions);
  } catch (err) { /* ignore */ }
}


// ==========================================
// Public API
// ==========================================
export {
  localGet, localSet,
  cookieGet, cookieSet,
}
