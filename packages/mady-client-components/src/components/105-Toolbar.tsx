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
  scope?: string;
  onClickParse: (ev: any) => void;
  onChangeQuickFind: (quickFind: string) => void;
  onChangeScope: (scope: string | null) => void;
};
type State = unknown;

// ==============================================
// Component
// ==============================================
class Toolbar extends React.Component<Props, State> {
  render() {
    return (
      <div className="mady-toolbar">
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
