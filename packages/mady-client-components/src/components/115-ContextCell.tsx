import React from 'react';
import classnames from 'classnames';
import type { Key } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
};

// ==============================================
// Component
// ==============================================
const ContextCell = ({ myKey }: Props) => {
  return (
    <div
      className={classnames('mady-context-cell', {
        unused: myKey.unusedSince != null,
      })}
    >
      <span className="mady-context-text">{myKey.context}</span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default ContextCell;
