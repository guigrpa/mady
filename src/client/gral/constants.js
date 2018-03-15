// @flow

/* eslint-env browser */

import tinycolor from 'tinycolor2';

// Detect theme
let THEME;
try {
  THEME = new URL(document.location).searchParams.get('theme');
} catch (err) {
  /* ignore */
}

const BASE_COLOR = tinycolor('aliceblue')
  .spin(40)
  .toHexString();
const BASE_COLOR2 = tinycolor('aliceblue')
  .spin(10)
  .toHexString();
const COLORS =
  THEME === 'embedded'
    ? {
        light: undefined,
        lightAlt: BASE_COLOR2,
        medium: '#f0f0f0',
        mediumAlt: '#f8f8f8',
        dark: '#e0e0e0',
        darkest: '#888',
        dim: '#999',
        accent: 'darkred',
      }
    : {
        light: BASE_COLOR,
        lightAlt: BASE_COLOR2,
        medium: tinycolor(BASE_COLOR)
          .darken(5)
          .toHexString(),
        mediumAlt: tinycolor(BASE_COLOR2)
          .darken(5)
          .toHexString(),
        dark: tinycolor(BASE_COLOR)
          .darken(10)
          .toHexString(),
        darkest: tinycolor(BASE_COLOR)
          .darken(65)
          .toHexString(),
        dim: '#999',
        accent: 'darkred',
      };

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ca', label: 'Català' },
];

// ==========================================
// Public API
// ==========================================
export { THEME, COLORS, LANG_OPTIONS };
