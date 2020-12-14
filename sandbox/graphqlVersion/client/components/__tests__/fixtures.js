const KEY_WITHOUT_TRANSLATIONS = {
  id: 'keyId1',
  context: 'someContext',
  text: 'A message',
  unusedSince: null,
  // unusedSince: '2016-04-20T11:33:38.450Z',
  translations: { edges: [] },
};

const UNUSED_KEY_WITHOUT_TRANSLATIONS = {
  id: 'keyId1',
  context: 'someContext',
  text: 'A message',
  unusedSince: '2016-04-20T11:33:38.450Z',
  translations: { edges: [] },
};

const KEY_WITH_TRANSLATIONS = {
  id: 'keyId2',
  context: 'someContext',
  text: 'A message',
  unusedSince: null,
  translations: {
    edges: [
      {
        node: {
          id: 'translationId1',
          lang: 'es',
          translation: 'Un mensaje',
        },
      },
      {
        node: {
          id: 'translationId2',
          lang: 'ca',
          translation: 'Un missatge',
        },
      },
    ],
  },
};

const KEY_WITH_FUZZY_TRANSLATION = {
  id: 'keyId3',
  context: 'someContext',
  text: 'This is the one',
  unusedSince: null,
  translations: {
    edges: [
      {
        node: {
          id: 'translationId1',
          lang: 'es',
          translation: 'Este es el bueno',
          fuzzy: true,
        },
      },
    ],
  },
};

const VIEWER = {
  id: 'me',
  config: {
    langs: ['es', 'ca', 'en'],
  },
  stats: {
    numUsedKeys: 2,
    numTotalKeys: 2,
    numTranslations: [
      { lang: 'es', value: 1 },
      { lang: 'ca', value: 1 },
      { lang: 'en', value: 0 },
    ],
  },
  keys: {
    edges: [
      { node: KEY_WITHOUT_TRANSLATIONS },
      { node: KEY_WITH_TRANSLATIONS },
    ],
  },
};
const STATS = VIEWER.stats;

const VIEWER_WITH_NO_CONTENT = {
  id: 'me',
  config: {
    langs: ['es', 'ca', 'en'],
  },
  stats: {
    numUsedKeys: 0,
    numTotalKeys: 0,
    numTranslations: [
      { lang: 'es', value: 0 },
      { lang: 'ca', value: 0 },
      { lang: 'en', value: 0 },
    ],
  },
  keys: { edges: [] },
};
const STATS_WITH_NO_CONTENT = VIEWER_WITH_NO_CONTENT.stats;

export {
  VIEWER,
  VIEWER_WITH_NO_CONTENT,
  STATS,
  STATS_WITH_NO_CONTENT,
  KEY_WITHOUT_TRANSLATIONS,
  KEY_WITH_TRANSLATIONS,
  KEY_WITH_FUZZY_TRANSLATION,
  UNUSED_KEY_WITHOUT_TRANSLATIONS,
};
