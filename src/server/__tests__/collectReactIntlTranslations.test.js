/* eslint-env jest */
import { merge } from 'timm';
import { mainStory } from 'storyboard';
import collectReactIntlTranslations from '../collectReactIntlTranslations';

const KEYS_WITHOUT_BRACES = {
  keyId1: {
    id: 'keyId1',
    reactIntlId: 'reactIntlId1',
    context: 'context',
    text: 'Hello there!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
  keyId2: {
    id: 'keyId2',
    // No React Intl ID
    context: 'context',
    text: 'Bye-bye!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
};

const KEYS_INCLUDING_SOME_WITH_BRACES = merge(KEYS_WITHOUT_BRACES, {
  keyId3: {
    id: 'keyId3',
    reactIntlId: 'reactIntlId3',
    context: 'context',
    text: 'Hello {NAME}!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
});

const TRANSLATIONS_ARRAY = [
  { keyId: 'keyId1', lang: 'es', translation: '¡Hola!' },
  { keyId: 'keyId2', lang: 'es', translation: '¡Adiós!' },
];

describe('collectReactIntlTranslations', () => {
  it('should include all translations with React Intl IDs, but not others', () => {
    const result = collectReactIntlTranslations({
      lang: 'es',
      keys: KEYS_WITHOUT_BRACES,
      translations: TRANSLATIONS_ARRAY,
      story: mainStory,
    });
    expect(result).toEqual({ reactIntlId1: '¡Hola!' });
  });

  it('should include keys with braces, even if no translation is available', () => {
    const result = collectReactIntlTranslations({
      lang: 'es',
      keys: KEYS_INCLUDING_SOME_WITH_BRACES,
      translations: [],
      story: mainStory,
    });
    expect(result).toEqual({ reactIntlId3: 'Hello {NAME}!' });
  });
});
