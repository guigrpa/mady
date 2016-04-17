import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { merge }            from 'timm';
import { omit }             from 'lodash';
require('font-awesome/css/font-awesome.css');

// ==========================================
// Component
// ==========================================
class Icon extends React.Component {
  static propTypes = {
    icon:             React.PropTypes.string.isRequired,
    size:             React.PropTypes.string,   // lg, 2x, 3x, 4x, 5x
    fFixedWidth:      React.PropTypes.bool,
    fSpin:            React.PropTypes.bool,
    style:            React.PropTypes.object,
    fDisabled:        React.PropTypes.bool,
    // all other props are passed through
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { icon, size, fFixedWidth, fSpin, fDisabled } = this.props;
    const otherProps = omit(this.props, ['icon', 'size', 'style']);
    if (fDisabled) otherProps.onClick = undefined;
    let className = `fa fa-${icon}`;
    if (size != null) className += ` fa-${size}`;
    if (fFixedWidth) className += ' fa-fw';
    if (icon === 'circle-o-notch' || fSpin) className += ' fa-spin';
    return <i className={className} {...otherProps} style={style.icon(this.props)} />;
  }
}

const style = {
  icon: ({ fDisabled, style: base }) => merge({
    cursor: fDisabled ? undefined : 'pointer',
    color: fDisabled ? '#999' : undefined,
    letterSpacing: 'normal',
  }, base),
};

export default Icon;
