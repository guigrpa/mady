import React                from 'react';
import PureRenderMixin      from 'react-addons-pure-render-mixin';
import {
  COLORS,
}                           from '../gral/constants';

// ==========================================
// Component
// ==========================================
class LargeMessage extends React.Component {
  static propTypes = {
    children:               React.PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.shouldComponentUpdate = PureRenderMixin.shouldComponentUpdate.bind(this);
  }

  render() {
    return (
      <div style={style.outer}>
        {this.props.children}
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: {
    fontSize: '1.4em',
    fontWeight: 500,
    color: COLORS.dim,
    padding: 10,
    textAlign: 'center',
  },
};

export default LargeMessage;
