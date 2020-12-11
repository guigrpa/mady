import React from 'react';
import classnames from 'classnames';
import { Icon } from 'giu';
import type { Key } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  lang: string;
  onDelete: (keyId: string, lang: string) => void;
};

// ==============================================
// Component
// ==============================================
const TranslationCell = ({ myKey, lang, onDelete }: Props) => {
  const translation = myKey.translations[lang];
  return (
    <div
      className={classnames('mady-translation-cell', {
        'mady-seq-starts': myKey.seqStarts,
        'mady-is-first-key': myKey.isFirstKey,
        unused: myKey.unusedSince != null,
      })}
    >
      <div className="mady-translation-text">{translation?.translation}</div>
      {translation && (
        <div className="mady-translation-buttons">
          <span className="mady-delete-translation" title="Delete translation">
            <Icon icon="times" onClick={() => onDelete(myKey.id, lang)} />
          </span>
        </div>
      )}
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default TranslationCell;
