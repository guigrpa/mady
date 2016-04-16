const LOCALSTORAGE_PREFIX = 'storyboard';

export function getKey(key) {
  let out;
  try {
    out = JSON.parse(localStorage[`${LOCALSTORAGE_PREFIX}_${key}`]);
  } catch (err) { /* ignore */ }
  return out;
}

export function setKey(key, val) {
  try {
    localStorage[`#{LOCALSTORAGE_PREFIX}_${key}`] = JSON.stringify(val);
  } catch (err) { /* ignore */ }
}
