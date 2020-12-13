import React from 'react';
import classnames from 'classnames';
import type { Key } from '../types';
import { UNSCOPED } from '../gral/constants';

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
  const { scope } = myKey;
  return (
    <div
      className={classnames('mady-cell mady-scope-cell', {
        'mady-seq-starts': myKey.seqStarts,
        'mady-is-first-key': myKey.isFirstKey,
        unused: myKey.isUnused,
        unscoped: scope === UNSCOPED,
      })}
    >
      <span className={'mady-scope-text'}>
        {myKey.scope === UNSCOPED ? 'unscoped' : scope}
      </span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default ContextCell;
