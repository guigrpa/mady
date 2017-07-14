/* eslint-env jest */
import { merge } from 'timm';
import { mainStory } from 'storyboard';
import compileTranslations from '../compileTranslations';

const KEYS_WITHOUT_BRACES = {
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
};

const KEYS_INCLUDING_SOME_WITH_BRACES = merge(KEYS_WITHOUT_BRACES, {
  keyId3: {
    id: 'keyId3',
    context: 'context',
    text: 'Hello {NAME}!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
  keyId4: {
    id: 'keyId4',
    context: 'context',
    text: 'Bye-bye, {NAME}!',
    sources: ['FILENAME'],
    unusedSince: null,
  },
});

const TRANSLATIONS_ARRAY = [
  { keyId: 'keyId1', lang: 'es', translation: '¡Hola!' },
  { keyId: 'keyId4', lang: 'es', translation: '¡Adiós, {NAME}!' },
];

describe('compileTranslations', () => {
  it('should include all keys for which a translation is available', () => {
    const result = compileTranslations({
      lang: 'es',
      keys: KEYS_WITHOUT_BRACES,
      translations: TRANSLATIONS_ARRAY,
      story: mainStory,
    });
    expect(result).toMatchSnapshot();
  });

  it('should include keys with braces, even if no translation is available', () => {
    const result = compileTranslations({
      lang: 'es',
      keys: KEYS_INCLUDING_SOME_WITH_BRACES,
      translations: TRANSLATIONS_ARRAY,
      story: mainStory,
    });
    expect(result).toMatchSnapshot();
  });

  it('should compile a key with plural selection', () => {
    const result = compileTranslations({
      lang: 'es',
      keys: {
        ID: {
          id: 'ID',
          text: '{NUM, plural, one{1 hamburger} other{# hamburgers}}',
        },
      },
      translations: [
        {
          keyId: 'ID',
          lang: 'es',
          translation:
            '{NUM, plural, one{1 hamburguesa} other{# hamburguesas}}',
        },
      ],
      story: mainStory,
    });
    expect(result).toMatchSnapshot();
  });

  it('should allow minification', () => {
    const result = compileTranslations({
      lang: 'es',
      keys: KEYS_INCLUDING_SOME_WITH_BRACES,
      translations: TRANSLATIONS_ARRAY,
      fMinify: true,
      story: mainStory,
    });
    expect(result).toMatchSnapshot();
  });
});
