import tinycolor from 'tinycolor2';

let scrollbarWidth = null;

const BASE_COLOR = tinycolor('aliceblue').spin(40).toHexString();
const BASE_COLOR2 = tinycolor('aliceblue').spin(10).toHexString();
export const COLORS = {
  light: BASE_COLOR,
  lightAlt: BASE_COLOR2,
  medium: tinycolor(BASE_COLOR).darken(5).toHexString(),
  mediumAlt: tinycolor(BASE_COLOR2).darken(5).toHexString(),
  dark: tinycolor(BASE_COLOR).darken(10).toHexString(),
  darkest: tinycolor(BASE_COLOR).darken(65).toHexString(),
  dim: '#999',
};

export function getScrollbarWidth() {
  if (scrollbarWidth == null) {
    const scrollDiv = document.createElement('div');
    scrollDiv.className = 'scrollbarMeasure';
    document.body.appendChild(scrollDiv);
    scrollbarWidth = scrollDiv.offsetWidth - scrollDiv.clientWidth;
    document.body.removeChild(scrollDiv);
  }
  return scrollbarWidth;
}

try {
  window.addEventListener('resize', () => {
    scrollbarWidth = null;
    getScrollbarWidth();
  });
} catch (err) { /* ignore */ }
