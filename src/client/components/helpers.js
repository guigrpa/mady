import timm                 from 'timm';

export function bindAll(_this, fnNames) {
  for (const name of fnNames) {
    _this[name] = _this[name].bind(_this);
  }
}

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
