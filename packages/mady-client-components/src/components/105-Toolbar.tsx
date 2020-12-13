import React from 'react';
import { DropDownMenu, Icon, LIST_SEPARATOR } from 'giu';
import { UNSCOPED } from '../gral/constants';

// ==============================================
// Declarations
// ==============================================
type Props = {
  quickFind: string;
  scopeMenu: boolean;
  scopes: string[];
  scope: string | undefined;
  filter: string;
  onClickParse: (ev: any) => void;
  onChangeQuickFind: (quickFind: string) => void;
  onChangeScope: (scope: string | undefined) => void;
  onChangeFilter: (filter: string) => void;
};
type State = unknown;

// ==============================================
// Component
// ==============================================
class Toolbar extends React.Component<Props, State> {
  render() {
    return (
      <div className="mady-toolbar">
        {this.renderFilterPicker()}
        {this.renderScopePicker()}
        {this.renderQuickFind()}
        {this.renderParse()}
        <div className="mady-sep" />
        <div className="mady-toolbar-title">
          <a href="https://github.com/guigrpa/mady" target="_blank">
            MADY
          </a>
        </div>
      </div>
    );
  }

  renderFilterPicker() {
    const { filter } = this.props;
    const items = [
      {
        label: filter !== 'ALL' ? 'All (remove filter)' : 'All (no filter)',
        value: 'ALL',
        keys: 'shift+mod+a',
      },
      LIST_SEPARATOR,
      { label: 'Unused messages', value: 'UNUSED', keys: 'mod+u' },
      { label: 'Missing translations', value: 'UNTRANSLATED', keys: 'mod+m' },
      { label: 'Dubious translations', value: 'FUZZY', keys: 'mod+y' },
    ];
    return (
      <div>
        <DropDownMenu
          className="mady-filter-picker"
          items={items}
          onClickItem={(_ev: MouseEvent, filter: any) => {
            this.props.onChangeFilter(filter);
          }}
        >
          <span className="mady-filter-picker-button">
            <Icon id="madyMenuFilter" icon="filter" title={'Filter'} />
          </span>
          {this.renderFilterName()}
        </DropDownMenu>
      </div>
    );
  }

  renderFilterName() {
    const { filter } = this.props;
    if (filter === 'ALL') return null;
    let text = '';
    if (filter === 'UNUSED') text = 'Unused';
    if (filter === 'UNTRANSLATED') text = 'Missing';
    if (filter === 'FUZZY') text = 'Dubious';
    return <span className="mady-filter-name">{text}</span>;
  }

  renderScopePicker() {
    if (!this.props.scopeMenu) return null;
    const { scopes, scope } = this.props;
    if (scopes.length < 2) return null;
    const options: Array<{
      label: any;
      value: string | null | undefined;
    }> = [];
    options.push({
      label: scope ? 'All (remove filter)' : 'All (no filter)',
      value: null,
    });
    if (scopes.indexOf(UNSCOPED) >= 0) {
      options.push({ label: this.renderScopeName(UNSCOPED), value: UNSCOPED });
    }
    options.push(LIST_SEPARATOR);
    scopes.forEach((scope) => {
      if (scope === UNSCOPED) return;
      options.push({ label: this.renderScopeName(scope), value: scope });
    });
    return (
      <div className="mady-toolbar-button">
        <DropDownMenu
          className="mady-scope-picker"
          items={options}
          onClickItem={(_ev: MouseEvent, scope: string | null) => {
            this.props.onChangeScope(scope);
          }}
        >
          <span className="mady-scope-picker-button">
            <Icon icon="tags" title="Scope" />
          </span>
          {this.renderScopeName(scope)}
        </DropDownMenu>
      </div>
    );
  }

  renderScopeName(scope?: string) {
    if (!scope) return null;
    if (scope === UNSCOPED) return 'Unscoped';
    const [first, ...rest] = scope.split('-');
    return (
      <span className="mady-scope-name">
        <b>{first}</b> {rest.join('-')}
      </span>
    );
  }

  renderQuickFind() {
    return (
      <input
        className="mady-quick-find"
        value={this.props.quickFind}
        onChange={(ev) => this.props.onChangeQuickFind(ev.target.value)}
        placeholder="Quick find 🔍"
      />
    );
  }

  renderParse() {
    return (
      <div
        className="mady-toolbar-button"
        title="Parse source files to update the message list"
      >
        <Icon
          className="mady-parse"
          icon="sync"
          onClick={this.props.onClickParse}
        />
      </div>
    );
  }
}

// ==============================================
// Public
// ==============================================
export default Toolbar;
