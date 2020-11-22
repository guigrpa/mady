import { merge } from 'timm';
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
  keyId5: {
    id: 'keyId5',
    context: 'context',
    text: 'Hello again!',
    sources: [],
    unusedSince: '2010-01-01T10:00:00Z',
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
  { id: 'trId1', keyId: 'keyId1', lang: 'es', translation: '¡Hola!' },
  { id: 'trId4', keyId: 'keyId4', lang: 'es', translation: '¡Adiós, {NAME}!' },
  { id: 'trId5', keyId: 'keyId5', lang: 'es', translation: '¡Hola de nuevo!' },
];

describe('compileTranslations', () => {
  it('should include translations for keys still being used', async () => {
    const result = await compileTranslations({
      lang: 'es',
      keys: KEYS_WITHOUT_BRACES,
      translations: TRANSLATIONS_ARRAY,
      scope: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('should include keys with braces, even if no translation is available', async () => {
    const result = await compileTranslations({
      lang: 'es',
      keys: KEYS_INCLUDING_SOME_WITH_BRACES,
      translations: TRANSLATIONS_ARRAY,
      scope: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('should compile a key with plural selection', async () => {
    const result = await compileTranslations({
      lang: 'es',
      keys: {
        ID: {
          id: 'ID',
          text: '{NUM, plural, one{1 hamburger} other{# hamburgers}}',
          sources: [],
        },
      },
      translations: [
        {
          id: 'trID',
          keyId: 'ID',
          lang: 'es',
          translation:
            '{NUM, plural, one{1 hamburguesa} other{# hamburguesas}}',
        },
      ],
      scope: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('should compile a key with Markdown', async () => {
    const result = await compileTranslations({
      lang: 'es',
      keys: {
        ID: {
          id: 'ID',
          text: '# Title',
          isMarkdown: true,
          sources: [],
        },
      },
      translations: [
        {
          id: 'trID',
          keyId: 'ID',
          lang: 'es',
          translation: '# Título',
        },
      ],
      scope: null,
    });
    expect(result).toMatchSnapshot();
  });

  it('should allow minification', async () => {
    const result = await compileTranslations({
      lang: 'es',
      keys: KEYS_INCLUDING_SOME_WITH_BRACES,
      translations: TRANSLATIONS_ARRAY,
      scope: null,
      fMinify: true,
    });
    expect(result).toMatchSnapshot();
  });
});
