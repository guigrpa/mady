import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin'
import {
  omit,
}                           from 'lodash';
import {
  cancelEvent,
}                           from './helpers';

// ==========================================
// Component
// ==========================================
class Button extends React.Component {
  static mixins = [PureRenderMixin];
  static propTypes = {
    fText:              React.PropTypes.bool,
    onClick:            React.PropTypes.func,
    fCancelMouseDown:   React.PropTypes.bool,
    // all other props are passed through
  };
  static defaultProps = {
    fText:              true,
  };

  render() { 
    const { fText, onClick, fCancelMouseDown } = this.props;
    const otherProps = omit(this.props, ['fText', 'onClick']);
    if (fCancelMouseDown) otherProps.onMouseDown = cancelEvent;
    if (fText) {
      return (
        <span 
          onClick={onClick}
          {...otherProps}
          style={style.outer}
        >
          {this.props.children}
        </span>
      );
    } else {
      return (
        <button
          onClick={onClick}
          {...otherProps}
          style={style.outer}
        >
          {this.props.children}
        </button>
      );
    }
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {},
};

export default Button;
