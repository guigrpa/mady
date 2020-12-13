import React from 'react';
import moment from 'moment';
import { Icon } from 'giu';
import type { Key } from '../types';

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

  // Tooltip
  const tooltip: string[] = [];
  const { firstUsed, unusedSince, sources } = myKey;
  let mom = moment(firstUsed);
  tooltip.push(`First used: ${mom.fromNow()} (${mom.format('LL')})`);
  if (unusedSince) {
    mom = moment(unusedSince);
    tooltip.push(`Last used: ${mom.fromNow()} (${mom.format('LL')})`);
  }
  if (sources) {
    tooltip.push('Used in:');
    sources.forEach((src) => tooltip.push(`- ${src}`));
  }
  return (
    <div className="mady-cell mady-key-cell" title={tooltip.join('\n')}>
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
