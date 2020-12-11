import React from 'react';
import { Icon } from 'giu';

// ==============================================
// Declarations
// ==============================================
type Props = {
  onClickParse: (ev: any) => void;
};

// ==============================================
// Component
// ==============================================
const Toolbar = ({ onClickParse }: Props) => (
  <div className="mady-toolbar">
    <div
      className="mady-toolbar-button"
      title="Parse source files to update the message list"
    >
      <Icon className="mady-parse" icon="sync" onClick={onClickParse} />
    </div>
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
