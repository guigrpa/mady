import React from 'react';
import classnames from 'classnames';
import { Icon } from 'giu';
import type { Key, Config } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  onDelete: (id: string) => void;
};

// ==============================================
// Component
// ==============================================
const KeyCell = ({ myKey, onDelete }: Props) => {
  let status;
  if (myKey.isUnused) status = 'unused';
  else if (!myKey.isTranslated) status = 'untranslated';
  else if (myKey.isFuzzy) status = 'fuzzy';
  else status = 'translated';
  return (
    <div
      className={classnames('mady-cell mady-key-cell', status, {
        'mady-seq-starts': myKey.seqStarts,
        'mady-is-first-key': myKey.isFirstKey,
      })}
    >
      <div className="mady-key-text">{myKey.text}</div>
      <div className="mady-key-buttons">
        <span title="Delete message (does NOT delete any translations)">
          <Icon icon="times" onClick={() => onDelete(myKey.id)} />
        </span>
      </div>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default KeyCell;
