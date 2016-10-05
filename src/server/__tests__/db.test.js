/* eslint-env jest */
/* eslint-disable global-require, arrow-parens, import/newline-after-import */
import path from 'path';
import { mainStory } from 'storyboard';
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
    keyId: 'someContext_someText',
    lang: 'es',
    translation: 'algúnTexto',
  },
  translationId2: {
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

  it('should allow updating the config', async () => {
    const writeFileSync = require('fs-extra').writeFileSync;
    writeFileSync.mockClear();
    await db.updateConfig({ fMinify: true }, { story: mainStory });
    expect(db.getConfig().fMinify).toBe(true);
    expect(writeFileSync.mock.calls[0][0]).toEqual(path.join(BASE_PATH, 'config.json'));
    expect(writeFileSync.mock.calls[1][0]).toEqual(path.join(BASE_PATH, 'en.js'));
    expect(writeFileSync.mock.calls[2][0]).toEqual(path.join(BASE_PATH, 'en.reactIntl.json'));
    db.updateConfig({ langs: ['en', 'es'] }, { story: mainStory });
  });

  // ==========================================
  // Keys
  // ==========================================
  it('should allow querying for a key', () => {
    db._setKeys(INITIAL_KEYS);
    expect(db.getKey('someContext_someText')).toEqual(INITIAL_KEYS.someContext_someText);
  });

  it('should allow querying for all keys', () => {
    db._setKeys(INITIAL_KEYS);
    expect(db.getKeys().length).toEqual(Object.keys(INITIAL_KEYS).length);
  });

  it('should allow creating keys', async () => {
    const writeFileSync = require('fs-extra').writeFileSync;
    writeFileSync.mockClear();
    db._setKeys({});
    const newKey = await db.createKey({
      context: 'someContext',
      text: 'someText',
      firstUsed: '2016-10-05T08:00:00.000Z',
    });
    expect(newKey).toMatchSnapshot();
    expect(db.getKeys()).toMatchSnapshot();
    expect(writeFileSync.mock.calls[0][0]).toEqual(path.join(BASE_PATH, 'keys.json'));
    expect(writeFileSync.mock.calls[1][0]).toEqual(path.join(BASE_PATH, 'en.js'));
    expect(writeFileSync.mock.calls[2][0]).toEqual(path.join(BASE_PATH, 'en.reactIntl.json'));
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

  it('should allow deleting keys', async () => {
    db._setKeys(INITIAL_KEYS);
    const deletedKey = await db.deleteKey('someContext_someText');
    expect(deletedKey).toMatchSnapshot();
    expect(db.getKeys()).toMatchSnapshot();
  });

  // ==========================================
  // Translations
  // ==========================================
  it('should allow querying for a translation', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getTranslation('translationId1')).toEqual(INITIAL_TRANSLATIONS.translationId1);
  });

  it('should allow querying for all translations', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getTranslations().length).toEqual(Object.keys(INITIAL_TRANSLATIONS).length);
  });

  it('should allow querying for all translations in a language', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getLangTranslations('es')).toEqual([INITIAL_TRANSLATIONS.translationId1]);
    expect(db.getLangTranslations('ca')).toEqual([INITIAL_TRANSLATIONS.translationId2]);
  });

  it('should allow querying for all translations for a certain key', () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    expect(db.getKeyTranslations('someContext_someText').length).toEqual(2);
    expect(db.getKeyTranslations('missingKey').length).toEqual(0);
  });

  it('should allow creating translations', async () => {
    const writeFileSync = require('fs-extra').writeFileSync;
    writeFileSync.mockClear();
    db._setKeys(INITIAL_KEYS);
    db._setTranslations({});
    const newTranslation = await db.createTranslation({
      keyId: 'someContext_someText',
      lang: 'es',
      translation: 'algúnTexto',
    }, { story: mainStory });
    expect(newTranslation.id).toBeTruthy();
    newTranslation.id = 'deterministicId';
    expect(newTranslation).toMatchSnapshot();
    expect(db.getTranslations()).toMatchSnapshot();
    expect(writeFileSync.mock.calls[0][0]).toEqual(path.join(BASE_PATH, 'es.json'));
    expect(writeFileSync.mock.calls[1][0]).toEqual(path.join(BASE_PATH, 'en.js'));
    expect(writeFileSync.mock.calls[2][0]).toEqual(path.join(BASE_PATH, 'en.reactIntl.json'));
  });

  it('should not allow the creation of incomplete translations', async () => {
    expect(() => db.createTranslation({}, { story: mainStory })).toThrow();
    expect(() => db.createTranslation({ lang: 'es' }, { story: mainStory })).toThrow();
  });

  it('should allow updating translations', async () => {
    db._setKeys(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    const updatedTranslation = await db.updateTranslation('translationId2', {
      translation: 'Una traducción mejor',
    }, { story: mainStory });
    expect(updatedTranslation).toMatchSnapshot();
    expect(db.getTranslations()).toMatchSnapshot();
  });

  it('should allow deleting translations', async () => {
    db._setTranslations(INITIAL_KEYS);
    db._setTranslations(INITIAL_TRANSLATIONS);
    const deletedTranslation = await db.deleteTranslation('translationId2',
      { story: mainStory });
    expect(deletedTranslation).toMatchSnapshot();
    expect(db.getTranslations()).toMatchSnapshot();
  });
});
