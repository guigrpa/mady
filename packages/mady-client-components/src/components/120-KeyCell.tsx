import React from 'react';
import classnames from 'classnames';
import type { Key, Config } from '../types';

// ==============================================
// Declarations
// ==============================================
type Props = {
  myKey: Key;
  config: Config;
  langs: string[];
};

// ==============================================
// Component
// ==============================================
const KeyCell = ({ myKey, config, langs: langs0 }: Props) => {
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
      <span className="mady-key-text">{myKey.text}</span>
    </div>
  );
};

// ==============================================
// Public
// ==============================================
export default KeyCell;
