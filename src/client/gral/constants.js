// @flow

import tinycolor from 'tinycolor2';

const BASE_COLOR = tinycolor('aliceblue').spin(40).toHexString();
const BASE_COLOR2 = tinycolor('aliceblue').spin(10).toHexString();
const COLORS = {
  light: BASE_COLOR,
  lightAlt: BASE_COLOR2,
  medium: tinycolor(BASE_COLOR).darken(5).toHexString(),
  mediumAlt: tinycolor(BASE_COLOR2).darken(5).toHexString(),
  dark: tinycolor(BASE_COLOR).darken(10).toHexString(),
  darkest: tinycolor(BASE_COLOR).darken(65).toHexString(),
  dim: '#999',
};

const LANG_OPTIONS = [
  { value: 'en', label: 'English' },
  { value: 'es', label: 'Español' },
  { value: 'ca', label: 'Català' },
];

// ==========================================
// Public API
// ==========================================
export { COLORS, LANG_OPTIONS };
