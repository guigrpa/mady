import { simplifyString } from 'giu';

// ===================================================
// Helpers
// ===================================================
const cachedSimplifiedStrings: Record<string, string> = {};
const simplifyStringWithCache = (str: string) => {
  let out = cachedSimplifiedStrings[str];
  if (out == null) {
    out = simplifyString(str);
    cachedSimplifiedStrings[str] = out;
  }
  return out;
};

// ===================================================
// Public
// ===================================================
export { simplifyStringWithCache };
