const KEY_WITHOUT_TRANSLATIONS = {
  id: 'keyId1',
  context: 'someContext',
  text: 'A message',
  unusedSince: null,
  // unusedSince: '2016-04-20T11:33:38.450Z',
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

const VIEWER = {
  id: 'me',
  config: {
    langs: ['es', 'ca', 'en'],
  },
  keys: {
    edges: [
      { node: KEY_WITHOUT_TRANSLATIONS },
      { node: KEY_WITH_TRANSLATIONS },
    ],
  },
};

const VIEWER_WITH_NO_CONTENT = {
  id: 'me',
  config: {
    langs: ['es', 'ca', 'en'],
  },
  keys: { edges: [] },
};

export {
  VIEWER,
  VIEWER_WITH_NO_CONTENT,
  KEY_WITHOUT_TRANSLATIONS,
  KEY_WITH_TRANSLATIONS,
};
