import React from 'react';
import { Icon, LIST_SEPARATOR } from 'giu';
import { UNSCOPED } from '../gral/constants';

// ==============================================
// Declarations
// ==============================================
type Props = {
  quickFind: string;
  scopes: string[];
  scope: string | null | undefined;
  onClickParse: (ev: any) => void;
  onChangeQuickFind: (quickFind: string) => void;
};
type State = unknown;

// ==============================================
// Component
// ==============================================
class Toolbar extends React.Component<Props, State> {
  render() {
    return (
      <div className="mady-toolbar">
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
        {this.renderScopeMenu()}
        {this.renderQuickFind()}
        <div className="mady-sep" />
        <div className="mady-toolbar-title">
          <a href="https://github.com/guigrpa/mady" target="_blank">
            MADY
          </a>
        </div>
      </div>
    );
  }

  renderScopeMenu() {
    const { scopes } = this.props;
    if (scopes.length < 2) return null;
    const options: Array<{
      label: string;
      value: string | null | undefined;
    }> = [];
    options.push({ label: 'All (no filter)', value: undefined });
    if (scopes.indexOf(UNSCOPED) >= 0) {
      options.push({ label: 'Unscoped', value: null });
    }
    options.push(LIST_SEPARATOR);
    scopes.forEach((scope) => {
      if (scope === UNSCOPED) return;
      options.push({ label: scope, value: scope });
    });
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
}

// ==============================================
// Public
// ==============================================
export default Toolbar;
