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
      className={classnames('mady-cell mady-scope-cell', {
        'mady-seq-starts': myKey.seqStarts,
        'mady-is-first-key': myKey.isFirstKey,
        unused: myKey.unusedSince != null,
        unscoped: !myKey.scope,
      })}
    >
      <span className={'mady-scope-text'}>{myKey.scope || 'unscoped'}</span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default ContextCell;
