import React from 'react';
import { Icon } from 'giu';

// ==============================================
// Declarations
// ==============================================
type Props = {
  filterValue: string;
  onClickParse: (ev: any) => void;
  onChangeFilterValue: (filterValue: string) => void;
};

// ==============================================
// Component
// ==============================================
const Toolbar = (props: Props) => (
  <div className="mady-toolbar">
    <div
      className="mady-toolbar-button"
      title="Parse source files to update the message list"
    >
      <Icon className="mady-parse" icon="sync" onClick={props.onClickParse} />
    </div>
    <input
      className="mady-filter-value"
      value={props.filterValue}
      onChange={(ev) => props.onChangeFilterValue(ev.target.value)}
      placeholder="Quick find 🔍"
    />
    <div className="mady-sep" />
    <div className="mady-toolbar-title">
      <a href="https://github.com/guigrpa/mady" target="_blank">
        MADY
      </a>
    </div>
  </div>
);

// ==============================================
// Public
// ==============================================
export default Toolbar;
