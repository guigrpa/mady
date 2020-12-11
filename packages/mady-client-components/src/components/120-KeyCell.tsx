import React from 'react';
import classnames from 'classnames';
import { Icon } from 'giu';
import type { Key, Config } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  config: Config;
  langs: string[];
  onDelete: (id: string) => void;
};

// ==============================================
// Component
// ==============================================
const KeyCell = ({ myKey, config, langs: langs0, onDelete }: Props) => {
  const langs = langs0.filter((lang) => lang !== config.originalLang);
  const translations = langs
    .map((lang) => myKey.translations[lang])
    .filter((o) => o != null && o.translation);
  let trait;
  if (myKey.unusedSince != null) trait = 'unused';
  else if (translations.length < langs.length) trait = 'untranslated';
  else if (translations.filter((o) => o.fuzzy).length > 0) trait = 'fuzzy';
  else trait = 'translated';
  return (
    <div className={classnames('mady-key-cell', trait)}>
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
