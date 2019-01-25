// @flow

/* eslint-disable react/prefer-stateless-function */

import React from 'react';
import {
  LIST_SEPARATOR,
  Icon,
  flexContainer,
  flexItem,
  hintShow,
  DropDownMenu,
} from 'giu';
import _t from '../../translate';
import { COLORS, UNSCOPED } from '../gral/constants';
import type { KeyFilter } from '../gral/types';

// ==========================================
// Component
// ==========================================
class Header extends React.PureComponent {
  props: {
    lang: string,
    onShowSettings: (ev?: SyntheticEvent) => void,
    filter: KeyFilter,
    changeFilter: (filter: KeyFilter) => any,
    scopes: Array<string>,
    scope: ?string,
    changeScope: (scope: ?string) => any,
  };

  // ==========================================
  render() {
    return (
      <div style={style.outer}>
        {this.renderFilter()}
        {this.renderScopes()}
        <div style={style.spacer} />
        {this.renderTitle()}
        {this.renderHelpButton()}
      </div>
    );
  }

  renderFilter() {
    const { filter } = this.props;
    const items = [
      {
        label:
          filter !== 'ALL'
            ? _t('filter_All (remove filter)')
            : _t('filter_All (no filter)'),
        value: 'ALL',
        keys: 'shift+mod+a',
      },
      LIST_SEPARATOR,
      { label: _t('filter_Unused messages'), value: 'UNUSED', keys: 'mod+u' },
      {
        label: _t('filter_Missing translations'),
        value: 'UNTRANSLATED',
        keys: 'mod+m',
      },
      {
        label: _t('filter_Dubious translations'),
        value: 'FUZZY',
        keys: 'mod+y',
      },
    ];
    return (
      <div style={style.left}>
        <DropDownMenu
          items={items}
          lang={this.props.lang}
          onClickItem={(ev: SyntheticEvent, val: any) => {
            this.props.changeFilter(val);
          }}
        >
          {this.renderFilterTitle()}
        </DropDownMenu>
      </div>
    );
  }

  renderFilterTitle() {
    const { filter } = this.props;
    let text = '';
    if (filter === 'UNUSED') text = _t('filter_Unused');
    if (filter === 'UNTRANSLATED') text = _t('filter_Missing');
    if (filter === 'FUZZY') text = _t('filter_Dubious');
    return (
      <div style={style.filterTitle}>
        <Icon id="madyMenuFilter" icon="filter" title={_t('tooltip_Filter')} />
        {!!text && <div style={style.filterTitleText}>{text}</div>}
      </div>
    );
  }

  renderScopes() {
    const { scopes } = this.props;
    if (!scopes.length) return null;
    const { scope } = this.props;
    const items = scopes.map(o => ({
      // $FlowFixMe
      label: this.renderScopeName(o),
      value: o,
    }));
    const disableValue = '___DISABLE_FILTER___';
    items.unshift(LIST_SEPARATOR);
    items.unshift({
      label: _t('filter_Unscoped'),
      value: UNSCOPED,
    });
    items.unshift({
      label:
        scope != null
          ? _t('filter_All (remove filter)')
          : _t('filter_All (no filter)'),
      value: disableValue,
    });
    return (
      <div style={style.left}>
        <DropDownMenu
          items={items}
          lang={this.props.lang}
          onClickItem={(ev: SyntheticEvent, val: any) => {
            this.props.changeScope(val !== disableValue ? val : null);
          }}
        >
          <div style={style.filterTitle}>
            <Icon id="madyMenuScope" icon="tags" title={_t('tooltip_Scope')} />
            {!!scope && (
              <div style={style.filterTitleText}>
                {this.renderScopeName(scope)}
              </div>
            )}
          </div>
        </DropDownMenu>
      </div>
    );
  }

  renderScopeName(scope: string) {
    if (scope === UNSCOPED) return _t('filter_Unscoped');
    const [first, ...rest] = scope.split('-');
    return (
      <span>
        <b>{first}</b> {rest.join('-')}
      </span>
    );
  }

  renderTitle() {
    return (
      <div style={style.title}>
        MADY
        <Icon
          id="madyBtnSettings"
          icon="cog"
          title={_t('tooltip_Settings')}
          onClick={this.props.onShowSettings}
          style={style.icon}
        />
      </div>
    );
  }

  renderHelpButton() {
    return (
      <div style={style.right}>
        <Icon icon="question-circle" onClick={() => hintShow('main', true)} />
      </div>
    );
  }

  // ==========================================
  onChangeFilter = (ev: SyntheticEvent, val: any) => {
    this.props.changeFilter(val);
  };
}

// ------------------------------------------
const style = {
  outer: flexItem(
    '0 0 2.5em',
    flexContainer('row', {
      backgroundColor: COLORS.medium,
      padding: '5px 4px',
      alignItems: 'center',
    })
  ),
  title: {
    fontWeight: 900,
    letterSpacing: 3,
    fontSize: '1.3em',
    paddingBottom: 1,
  },
  spacer: flexItem(1),
  icon: { margin: '0 1em' },
  filterTitle: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  filterTitleText: {
    display: 'inline-block',
    marginLeft: 5,
  },
  right: {
    fontWeight: 900,
    letterSpacing: 3,
    fontSize: '1.3em',
    textAlign: 'right',
    marginRight: 10,
  },
  left: {},
};

// ==========================================
// Public API
// ==========================================
export default Header;
