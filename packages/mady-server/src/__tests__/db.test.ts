import path from 'path';
import fs from 'fs-extra';
import * as db from '../db';

jest.mock('fs-extra');

const INITIAL_KEYS = {
  someContext_someText: {
    id: 'someContext_someText',
    context: 'someContext',
    text: 'someText',
    firstUsed: '2016-10-05T08:00:00.000Z',
    sources: ['FOO'],
    unusedSince: null,
  },
  anotherText: {
    id: 'anotherText',
    context: null,
    text: 'anotherText',
    firstUsed: null,
    sources: [],
    unusedSince: null,
  },
};

const BASE_PATH = 'examplePath';

const INITIAL_TRANSLATIONS = {
  translationId1: {
    id: 'tr1',
    keyId: 'someContext_someText',
    lang: 'es',
    translation: 'algúnTexto',
  },
  translationId2: {
    id: 'tr2',
    keyId: 'someContext_someText',
    lang: 'ca',
    translation: 'algunText',
  },
};

describe('db', () => {
  beforeEach(() => {
    db._setLocaleDir(BASE_PATH);
    db._setKeyPath(path.join(BASE_PATH, 'keys.json'));
    db._setConfigPath(path.join(BASE_PATH, 'config.json'));
    db._setConfig(db._DEFAULT_CONFIG);
  });

  // ==========================================
  // Config
  // ==========================================
  it('should allow reading the current config', () => {
    expect(db.getConfig()).toEqual(db._DEFAULT_CONFIG);
  });

  // ==========================================
  // Keys
  // ==========================================
  it('should allow querying for a key', () => {
    db._setKeys(INITIAL_KEYS);
    expect(db.getKey('someContext_someText')).toEqual(
      INITIAL_KEYS.someContext_someText
    );
  });

  it('should allow querying for all keys', () => {
    db._setKeys(INITIAL_KEYS);
    expect(db.getKeys().length).toEqual(Object.keys(INITIAL_KEYS).length);
  });

  it('should allow creating keys', async () => {
    const writeJsonSync = fs.writeJsonSync as any;
    writeJsonSync.mockClear();
    db._setKeys({});
    const newKey = await db.createKey({
      context: 'someContext',
      text: 'someText',
      firstUsed: '2016-10-05T08:00:00.000Z',
    });
    expect(newKey).toMatchSnapshot();
    expect(db.getKeys()).toMatchSnapshot();
    expect(writeJsonSync.mock.calls[0][0]).toEqual(
      path.join(BASE_PATH, 'keys.json')
    );
  });

  it('should allow updating keys', async () => {
    db._setKeys(INITIAL_KEYS);
    const updatedKey = await db.updateKey('someContext_someText', {
      unusedSince: '2016-10-05T12:00:00.000Z',
      sources: [],
    });
    expect(updatedKey).toMatchSnapshot();
    expect(db.getKeys()).toMatchSnapshot();
  });

  // ==========================================
  // Translations
  // ==========================================
  it('should allow querying for a translation', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getTranslation('translationId1')).toEqual(
      INITIAL_TRANSLATIONS.translationId1
    );
  });

  it('should allow querying for all translations', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getTranslations().length).toEqual(
      Object.keys(INITIAL_TRANSLATIONS).length
    );
  });

  it('should allow querying for all translations in a language', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getLangTranslations('es')).toEqual([
      INITIAL_TRANSLATIONS.translationId1,
    ]);
    expect(db.getLangTranslations('ca')).toEqual([
      INITIAL_TRANSLATIONS.translationId2,
    ]);
  });

  it('should allow querying for all translations for a certain key', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getKeyTranslations('someContext_someText').length).toEqual(2);
    expect(db.getKeyTranslations('missingKey').length).toEqual(0);
  });

  it('should allow creating translations', async () => {
    const writeJsonSync = fs.writeJsonSync as any;
    writeJsonSync.mockClear();
    db._setKeys(INITIAL_KEYS);
    db._setTranslations({});
    const newTranslation = await db.createTranslation({
      keyId: 'someContext_someText',
      lang: 'es',
      translation: 'algúnTexto',
    });
    expect(newTranslation.id).toBeTruthy();
    newTranslation.id = 'deterministicId';
    expect(newTranslation).toMatchSnapshot();
    expect(db.getTranslations()).toMatchSnapshot();
    expect(writeJsonSync.mock.calls[0][0]).toEqual(
      path.join(BASE_PATH, 'es.json')
    );
  });

  it('should not allow the creation of incomplete translations', async () => {
    try {
      await db.createTranslation({});
      throw new Error('SHOULD_HAVE_THROWN');
    } catch (err) {
      if (err.message === 'SHOULD_HAVE_THROWN') throw err;
    }

    try {
      await db.createTranslation({ lang: 'es' });
      throw new Error('SHOULD_HAVE_THROWN');
    } catch (err) {
      if (err.message === 'SHOULD_HAVE_THROWN') throw err;
    }
  });

  it('should allow updating translations', async () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    const updatedTranslation = await db.updateTranslation('translationId2', {
      translation: 'Una traducción mejor',
    });
    expect(updatedTranslation).toMatchSnapshot();
    expect(db.getTranslations()).toMatchSnapshot();
  });
});
