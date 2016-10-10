/* eslint-env jest */
import { mainStory } from 'storyboard';
import collectJsonTranslations from '../collectJsonTranslations';

const KEYS = {
  keyId1: {
    id: 'keyId1',
    context: 'context',
    text: 'Hello there!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
  keyId2: {
    id: 'keyId2',
    context: 'context',
    text: 'Bye-bye!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
  keyId3: {
    id: 'keyId3',
    reactIntlId: 'reactIntlId3',
    context: 'context',
    text: 'Hello AGAIN!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
};

const TRANSLATIONS_ARRAY = [
  { keyId: 'keyId1', lang: 'es', translation: '¡Hola!' },
  { keyId: 'keyId2', lang: 'es', translation: '¡Adiós!' },
];

describe('collectJsonTranslations', () => {
  it('should include messages with translations, but not others', () => {
    const result = collectJsonTranslations({
      lang: 'es',
      keys: KEYS,
      translations: TRANSLATIONS_ARRAY,
      story: mainStory,
    });
    expect(result).toEqual({
      'context_Hello there!': '¡Hola!',
      'context_Bye-bye!': '¡Adiós!',
    });
  });
});
