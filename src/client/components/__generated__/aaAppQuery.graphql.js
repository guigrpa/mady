/**
 * @flow
 * @relayHash b4de7a7bc03f1ca2f509d8ee8666d98b
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type aaAppQueryResponse = {|
  +viewer: ?{|
    +id: string;
    +config: {| |};
  |};
|};
*/


/*
query aaAppQuery {
  viewer {
    id
    ...adTranslator_viewer
    config {
      ...aeSettings_config
      id
    }
  }
}

fragment adTranslator_viewer on Viewer {
  id
  config {
    langs
    id
  }
  stats {
    ...ecTranslatorHeader_stats
    id
  }
  keys(first: 100000) {
    edges {
      node {
        id
        isDeleted
        unusedSince
        context
        text
        translations(first: 100000) {
          edges {
            node {
              isDeleted
              lang
              fuzzy
              id
              __typename
            }
            cursor
          }
          pageInfo {
            endCursor
            hasNextPage
          }
        }
        ...edTranslatorRow_theKey
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment aeSettings_config on Config {
  langs
  srcPaths
  srcExtensions
  msgFunctionNames
  msgRegexps
  fMinify
  fJsOutput
  fJsonOutput
  fReactIntlOutput
}

fragment ecTranslatorHeader_stats on Stats {
  numTotalKeys
  numUsedKeys
  numTranslations {
    lang
    value
  }
}

fragment edTranslatorRow_theKey on Key {
  id
  context
  text
  unusedSince
  ...eeTranslation_theKey
  translations(first: 100000) {
    edges {
      node {
        id
        isDeleted
        lang
        ...eeTranslation_translation
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment eeTranslation_theKey on Key {
  id
  text
  isMarkdown
}

fragment eeTranslation_translation on Translation {
  id
  isDeleted
  lang
  translation
  fuzzy
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "aaAppQuery",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "FragmentSpread",
            "name": "adTranslator_viewer",
            "args": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Config",
            "name": "config",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "aeSettings_config",
                "args": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "aaAppQuery",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "aaAppQuery",
    "operation": "query",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "Viewer",
        "name": "viewer",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "id",
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Config",
            "name": "config",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "langs",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "Config",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "srcPaths",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "srcExtensions",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "msgFunctionNames",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "msgRegexps",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "fMinify",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "fJsOutput",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "fJsonOutput",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "fReactIntlOutput",
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "Stats",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numTotalKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numUsedKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "StatsForLang",
                    "name": "numTranslations",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "lang",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "value",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100000,
                "type": "Int"
              }
            ],
            "concreteType": "KeyConnection",
            "name": "keys",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "KeyEdge",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "Key",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "id",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "isDeleted",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "unusedSince",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "context",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "text",
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 100000,
                            "type": "Int"
                          }
                        ],
                        "concreteType": "TranslationConnection",
                        "name": "translations",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "TranslationEdge",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "args": null,
                                "concreteType": "Translation",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "isDeleted",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "lang",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "fuzzy",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "id",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "__typename",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "translation",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "cursor",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "args": null,
                            "concreteType": "PageInfo",
                            "name": "pageInfo",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "endCursor",
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "args": null,
                                "name": "hasNextPage",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": "translations{\"first\":100000}"
                      },
                      {
                        "kind": "LinkedHandle",
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 100000,
                            "type": "Int"
                          }
                        ],
                        "handle": "connection",
                        "name": "translations",
                        "key": "Translator_viewer_translations",
                        "filters": null
                      },
                      {
                        "kind": "LinkedHandle",
                        "alias": null,
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "first",
                            "value": 100000,
                            "type": "Int"
                          }
                        ],
                        "handle": "connection",
                        "name": "translations",
                        "key": "TranslatorRow_theKey_translations",
                        "filters": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "isMarkdown",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "__typename",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "cursor",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "PageInfo",
                "name": "pageInfo",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "endCursor",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "hasNextPage",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "keys{\"first\":100000}"
          },
          {
            "kind": "LinkedHandle",
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100000,
                "type": "Int"
              }
            ],
            "handle": "connection",
            "name": "keys",
            "key": "Translator_viewer_keys",
            "filters": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "query aaAppQuery {\n  viewer {\n    id\n    ...adTranslator_viewer\n    config {\n      ...aeSettings_config\n      id\n    }\n  }\n}\n\nfragment adTranslator_viewer on Viewer {\n  id\n  config {\n    langs\n    id\n  }\n  stats {\n    ...ecTranslatorHeader_stats\n    id\n  }\n  keys(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        unusedSince\n        context\n        text\n        translations(first: 100000) {\n          edges {\n            node {\n              isDeleted\n              lang\n              fuzzy\n              id\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n        ...edTranslatorRow_theKey\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment aeSettings_config on Config {\n  langs\n  srcPaths\n  srcExtensions\n  msgFunctionNames\n  msgRegexps\n  fMinify\n  fJsOutput\n  fJsonOutput\n  fReactIntlOutput\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n\nfragment edTranslatorRow_theKey on Key {\n  id\n  context\n  text\n  unusedSince\n  ...eeTranslation_theKey\n  translations(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        lang\n        ...eeTranslation_translation\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment eeTranslation_theKey on Key {\n  id\n  text\n  isMarkdown\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
