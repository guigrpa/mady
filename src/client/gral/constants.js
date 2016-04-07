let scrollbarWidth = null;

export default {};

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
