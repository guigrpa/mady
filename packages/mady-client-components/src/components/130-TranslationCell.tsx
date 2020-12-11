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
  if (!translation?.translation) return null;
  return (
    <div
      className={classnames('mady-translation-cell', {
        unused: myKey.unusedSince != null,
      })}
    >
      <div className="mady-translation-text">{translation.translation}</div>
      <div className="mady-translation-buttons">
        <span className="mady-delete-translation" title="Delete translation">
          <Icon icon="times" onClick={() => onDelete(myKey.id, lang)} />
        </span>
      </div>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default TranslationCell;
