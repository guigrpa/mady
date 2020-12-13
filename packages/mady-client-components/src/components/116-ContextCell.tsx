import React from 'react';
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
    <div className="mady-cell mady-context-cell">
      <span className={'mady-context-text'}>{myKey.context}</span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default ContextCell;
