import React                from 'react';
import {
  flexContainer,
  flexItem,
}                           from './helpers';
import Icon                 from './905-icon';

// ==========================================
// Component
// ==========================================
class Header extends React.Component {
  static propTypes = {
    onShowSettings:         React.PropTypes.func.isRequired,
  };

  render() {
    return (
      <div style={style.outer}>
        <div>A</div>
        <div style={style.spacer} />
        <Icon icon='cog' onClick={this.props.onShowSettings} />
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: flexItem('0 0 2em', flexContainer('row', {
    backgroundColor: '#ccc',
    padding: 5,
  })),
  spacer: flexItem('1'),
};

// ==========================================
// Public API
// ==========================================
export default Header;
