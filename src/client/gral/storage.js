// @flow

/* eslint-env browser */
let Cookie: any;
/* eslint-disable global-require */
if (!process.env.SERVER_SIDE_RENDERING) Cookie = require('tiny-cookie');
/* eslint-enable global-require */
const NAMESPACE = 'mady';

// SSR
type Cookies = ?{ [key: string]: string };
let currentCookies: Cookies;
function setCurrentCookies(cookies: Cookies) { currentCookies = cookies; }

function localGet(key: string, { defaultValue }: {
  defaultValue: any,
} = {}): any {
  let out = defaultValue;
  try {
    const str: any = localStorage[`${NAMESPACE}_${key}`];
    out = JSON.parse(str);
  } catch (err) { /* ignore */ }
  return out;
}

function localSet(key: string, val: any): void {
  try {
    localStorage[`${NAMESPACE}_${key}`] = JSON.stringify(val);
  } catch (err) { /* ignore */ }
}

// Note: tiny-cookie does not distinguish between undefined cookies
// and null-valued ones...
function cookieGet(key: string, { defaultValue }: {
  defaultValue: any,
} = {}): any {
  let out;
  const fullKey = `${NAMESPACE}_${key}`;
  try {
    const raw = currentCookies ? currentCookies[fullKey] : Cookie.getRaw(fullKey);
    out = JSON.parse(raw);
  } catch (err) { /* ignore */ }
  if (out == null) out = defaultValue;
  return out;
}

function cookieSet(key: string, val: any): void {
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

  setCurrentCookies,
  cookieGet, cookieSet,
};
