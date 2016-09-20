/* eslint-env browser */
/* eslint-disable global-require */
const Cookie = !process.env.SERVER_SIDE_RENDERING && require('tiny-cookie');
/* eslint-enable global-require */
const NAMESPACE = 'mady';

// SSR
let currentCookies = null;

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
  const fullKey = `${NAMESPACE}_${key}`;
  try {
    const raw = currentCookies ? currentCookies[fullKey] : Cookie.getRaw(fullKey);
    out = JSON.parse(raw);
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

// SSR
function setCurrentCookies(cookies) { currentCookies = cookies; }

// ==========================================
// Public API
// ==========================================
export {
  localGet, localSet,
  cookieGet, cookieSet,

  setCurrentCookies,
};
