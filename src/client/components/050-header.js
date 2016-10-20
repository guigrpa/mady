// @flow

import React                from 'react';
import { merge }            from 'timm';
import {
  Icon,
  flexContainer, flexItem,
  hintShow,
}                           from 'giu';
import _t                   from '../../translate';
import { COLORS }           from '../gral/constants';

// ==========================================
// Component declarations
// ==========================================
type PropsT = {
  onShowSettings: (ev?: SyntheticEvent) => void;
};

// ==========================================
// Component
// ==========================================
const Header = ({ onShowSettings }: PropsT) => (
  <div style={style.outer}>
    <div style={style.spacer} />
    <div style={style.title}>
      MADY
      <Icon
        id="madyBtnSettings"
        icon="cog"
        title={_t('tooltip_Settings')}
        onClick={onShowSettings}
        style={style.icon}
      />
    </div>
    <div style={merge(style.spacer, style.help)}>
      <Icon icon="question-circle" onClick={() => hintShow('main', true)} />
    </div>
  </div>
);

// ------------------------------------------
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
  help: {
    fontWeight: 900,
    letterSpacing: 3,
    fontSize: '1.3em',
    textAlign: 'right',
    marginRight: 10,
  },
};

// ==========================================
// Public API
// ==========================================
export default Header;
