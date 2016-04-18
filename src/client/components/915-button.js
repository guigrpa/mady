import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import { omit }             from 'lodash';
import { cancelEvent }      from './helpers';

// ==========================================
// Component
// ==========================================
class Button extends React.Component {
  static propTypes = {
    fText:                  React.PropTypes.bool,
    onClick:                React.PropTypes.func,
    fCancelMouseDown:       React.PropTypes.bool,
    children:               React.PropTypes.any,
    // all other props are passed through
  };
  static defaultProps = {
    fText:              false,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    const { fText, onClick, fCancelMouseDown } = this.props;
    const otherProps = omit(this.props, ['fText', 'onClick']);
    if (fCancelMouseDown) otherProps.onMouseDown = cancelEvent;
    let out;
    if (fText) {
      out = (
        <span
          onClick={onClick}
          {...otherProps}
          style={style.outer}
        >
          {this.props.children}
        </span>
      );
    } else {
      out = (
        <button
          onClick={onClick}
          {...otherProps}
          style={style.outer}
        >
          {this.props.children}
        </button>
      );
    }
    return out;
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    cursor: 'pointer',
  },
};

export default Button;
