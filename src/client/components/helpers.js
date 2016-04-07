import timm                 from 'timm';

export function flexItem(flex, style) {
  return timm.merge({
    flex,
    WebkitFlex: flex,
  }, style);
}

export function flexContainer(flexDirection, style) {
  return timm.merge({
    display: 'flex',
    flexDirection,
  }, style);
}
