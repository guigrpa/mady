import tinycolor from 'tinycolor2';

let scrollbarWidth = null;

export const COLORS = {
  lightBlue: 'aliceblue',
  mediumBlue: tinycolor('aliceblue').darken(5).toHexString(),
  darkBlue: tinycolor('aliceblue').darken(10).toHexString(),
  darkestBlue: tinycolor('aliceblue').darken(65).toHexString(),
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
