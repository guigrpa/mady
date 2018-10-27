/**
 * @flow
 * @relayHash ab70a15c299f75e007d2eb1a4f1fe0df
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type adTranslator_viewer$ref = any;
export type parsedSrcFilesSubscriptionVariables = {||};
export type parsedSrcFilesSubscriptionResponse = {|
  +parsedSrcFiles: ?{|
    +viewer: ?{|
      +$fragmentRefs: adTranslator_viewer$ref
    |}
  |}
|};
export type parsedSrcFilesSubscription = {|
  variables: parsedSrcFilesSubscriptionVariables,
  response: parsedSrcFilesSubscriptionResponse,
|};
*/


/*
subscription parsedSrcFilesSubscription {
  parsedSrcFiles {
    viewer {
      ...adTranslator_viewer
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

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "lang",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100000,
    "type": "Int"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "pageInfo",
  "storageKey": null,
  "args": null,
  "concreteType": "PageInfo",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endCursor",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "hasNextPage",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "parsedSrcFilesSubscription",
  "id": null,
  "text": "subscription parsedSrcFilesSubscription {\n  parsedSrcFiles {\n    viewer {\n      ...adTranslator_viewer\n      id\n    }\n  }\n}\n\nfragment adTranslator_viewer on Viewer {\n  id\n  config {\n    langs\n    id\n  }\n  stats {\n    ...ecTranslatorHeader_stats\n    id\n  }\n  keys(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        unusedSince\n        context\n        text\n        translations(first: 100000) {\n          edges {\n            node {\n              isDeleted\n              lang\n              fuzzy\n              id\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n        ...edTranslatorRow_theKey\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n\nfragment edTranslatorRow_theKey on Key {\n  id\n  context\n  text\n  unusedSince\n  ...eeTranslation_theKey\n  translations(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        lang\n        ...eeTranslation_translation\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment eeTranslation_theKey on Key {\n  id\n  text\n  isMarkdown\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "parsedSrcFilesSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parsedSrcFiles",
        "storageKey": null,
        "args": null,
        "concreteType": "ParsedSrcFilesPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "adTranslator_viewer",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "parsedSrcFilesSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parsedSrcFiles",
        "storageKey": null,
        "args": null,
        "concreteType": "ParsedSrcFilesPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "viewer",
            "storageKey": null,
            "args": null,
            "concreteType": "Viewer",
            "plural": false,
            "selections": [
              v0,
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "config",
                "storageKey": null,
                "args": null,
                "concreteType": "Config",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "langs",
                    "args": null,
                    "storageKey": null
                  },
                  v0
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "stats",
                "storageKey": null,
                "args": null,
                "concreteType": "Stats",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "numTotalKeys",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "numUsedKeys",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "numTranslations",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "StatsForLang",
                    "plural": true,
                    "selections": [
                      v1,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  v0
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "keys",
                "storageKey": "keys(first:100000)",
                "args": v2,
                "concreteType": "KeyConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "KeyEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Key",
                        "plural": false,
                        "selections": [
                          v0,
                          v3,
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "unusedSince",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "context",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "text",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "translations",
                            "storageKey": "translations(first:100000)",
                            "args": v2,
                            "concreteType": "TranslationConnection",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "edges",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "TranslationEdge",
                                "plural": true,
                                "selections": [
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "node",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Translation",
                                    "plural": false,
                                    "selections": [
                                      v3,
                                      v1,
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "fuzzy",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      v0,
                                      v4,
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "translation",
                                        "args": null,
                                        "storageKey": null
                                      }
                                    ]
                                  },
                                  v5
                                ]
                              },
                              v6
                            ]
                          },
                          {
                            "kind": "LinkedHandle",
                            "alias": null,
                            "name": "translations",
                            "args": v2,
                            "handle": "connection",
                            "key": "Translator_viewer_translations",
                            "filters": null
                          },
                          {
                            "kind": "LinkedHandle",
                            "alias": null,
                            "name": "translations",
                            "args": v2,
                            "handle": "connection",
                            "key": "TranslatorRow_theKey_translations",
                            "filters": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "isMarkdown",
                            "args": null,
                            "storageKey": null
                          },
                          v4
                        ]
                      },
                      v5
                    ]
                  },
                  v6
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "keys",
                "args": v2,
                "handle": "connection",
                "key": "Translator_viewer_keys",
                "filters": null
              }
            ]
          }
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '1d8a894cbd23df335a54c7c4dd92edd2';
module.exports = node;
