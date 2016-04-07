import React                from 'react';
import Relay                from 'react-relay';
import moment               from 'moment';
import {
  flexItem,
}                           from './helpers';

// ==========================================
// Relay fragments
// ==========================================
const fragments = {
  node: () => Relay.QL`
    fragment on Key {
      context text
      firstUsed unusedSince
      sources
    }
  `,
};

// ==========================================
// Component
// ==========================================
class Details extends React.Component {
  static propTypes = {
    node:                   React.PropTypes.object,
  };

  render() {
    return (
      <div style={style.outer}>
        {this.renderContents()}
      </div>
    );
  }

  renderContents() {
    const key = this.props.node;
    if (!key) return null;
    const { text, firstUsed } = key;
    return (
      <div>
        <div><b>{text}</b></div>
        <div>First used: {moment(firstUsed).format('LLLL')}</div>
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: flexItem('none', {
    minHeight: 70,
    backgroundColor: '#ccc',
    padding: 5,
    marginTop: 5,
  }),
};

// ==========================================
// Public API
// ==========================================
export default Relay.createContainer(Details, { fragments });
