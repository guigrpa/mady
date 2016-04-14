import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin'
import { merge }            from 'timm';
import { omit }             from 'lodash';
require('font-awesome/css/font-awesome.css');

// ==========================================
// Component
// ==========================================
class Icon extends React.Component {
  static mixins = [PureRenderMixin];
  static propTypes = {
    icon:             React.PropTypes.string.isRequired,
    size:             React.PropTypes.string,   // lg, 2x, 3x, 4x, 5x
    fFixedWidth:      React.PropTypes.bool,
    style:            React.PropTypes.object,
    fDisabled:        React.PropTypes.bool,
    // all other props are passed through
  };
  static defaultProps = {
    fFixedWidth:      false,
  };

  render() { 
    const { icon, size, fFixedWidth, fDisabled } = this.props;
    const otherProps = omit(this.props, ['icon', 'size', 'style']);
    if (fDisabled) otherProps.onClick = undefined;
    let className = `fa fa-${icon}`;
    if (size != null) className += ` fa-${size}`;
    if (fFixedWidth) className += ' fa-fw';
    if (icon === 'circle-o-notch') className += " fa-spin"
    return <i className={className} {...otherProps} style={style.icon(this.props)}/>;
  }
}

const style = {
  icon: ({ fDisabled, style }) => merge({
    cursor: fDisabled ? undefined : 'pointer',
    color: fDisabled ? '#999' : undefined,
  }, style),
};

export default Icon;
