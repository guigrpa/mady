import React                from 'react';
import _t                   from '../../translate';
import { COLORS }           from '../gral/constants';
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
        <div style={style.spacer} />
        <div style={style.title}>
          MADY
          <Icon
            icon="cog"
            title={_t('tooltip_Settings')}
            onClick={this.props.onShowSettings}
            style={style.icon}
          />
        </div>
        <div style={style.spacer} />
      </div>
    );
  }
}

// ==========================================
// Styles
// ==========================================
const style = {
  outer: flexItem('0 0 2.5em', flexContainer('row', {
    backgroundColor: COLORS.medium,
    padding: '5px 8px',
    alignItems: 'center',
  })),
  title: {
    fontWeight: 900,
    letterSpacing: 3,
    fontSize: '1.3em',
  },
  spacer: flexItem('1'),
  icon: {
    marginLeft: 10,
  },
};

// ==========================================
// Public API
// ==========================================
export default Header;
