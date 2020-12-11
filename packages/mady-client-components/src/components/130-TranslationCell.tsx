import React from 'react';
import classnames from 'classnames';
import type { Key } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  lang: string;
};

// ==============================================
// Component
// ==============================================
const TranslationCell = ({ myKey, lang }: Props) => {
  return (
    <div
      className={classnames('mady-translation-cell', {
        unused: myKey.unusedSince != null,
      })}
    >
      <span className="mady-translation-text">
        {myKey.translations[lang]?.translation}
      </span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default TranslationCell;
