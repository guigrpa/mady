/**
 * @flow
 * @relayHash 910b0e21b48021827ecf92dadfb361e9
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type adTranslator_viewer$ref = any;
export type ParseSrcFilesInput = {
  storyId?: ?string,
  clientMutationId?: ?string,
};
export type parseSrcFilesMutationVariables = {|
  input: ParseSrcFilesInput
|};
export type parseSrcFilesMutationResponse = {|
  +parseSrcFiles: ?{|
    +viewer: ?{|
      +$fragmentRefs: adTranslator_viewer$ref
    |}
  |}
|};
export type parseSrcFilesMutation = {|
  variables: parseSrcFilesMutationVariables,
  response: parseSrcFilesMutationResponse,
|};
*/


/*
mutation parseSrcFilesMutation(
  $input: ParseSrcFilesInput!
) {
  parseSrcFiles(input: $input) {
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
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "ParseSrcFilesInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "ParseSrcFilesInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "lang",
  "args": null,
  "storageKey": null
},
v4 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100000,
    "type": "Int"
  }
],
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v8 = {
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
  "operationKind": "mutation",
  "name": "parseSrcFilesMutation",
  "id": null,
  "text": "mutation parseSrcFilesMutation(\n  $input: ParseSrcFilesInput!\n) {\n  parseSrcFiles(input: $input) {\n    viewer {\n      ...adTranslator_viewer\n      id\n    }\n  }\n}\n\nfragment adTranslator_viewer on Viewer {\n  id\n  config {\n    langs\n    id\n  }\n  stats {\n    ...ecTranslatorHeader_stats\n    id\n  }\n  keys(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        unusedSince\n        context\n        text\n        translations(first: 100000) {\n          edges {\n            node {\n              isDeleted\n              lang\n              fuzzy\n              id\n              __typename\n            }\n            cursor\n          }\n          pageInfo {\n            endCursor\n            hasNextPage\n          }\n        }\n        ...edTranslatorRow_theKey\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n\nfragment edTranslatorRow_theKey on Key {\n  id\n  context\n  text\n  unusedSince\n  ...eeTranslation_theKey\n  translations(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        lang\n        ...eeTranslation_translation\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n    }\n  }\n}\n\nfragment eeTranslation_theKey on Key {\n  id\n  text\n  isMarkdown\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "parseSrcFilesMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parseSrcFiles",
        "storageKey": null,
        "args": v1,
        "concreteType": "ParseSrcFilesPayload",
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
    "name": "parseSrcFilesMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "parseSrcFiles",
        "storageKey": null,
        "args": v1,
        "concreteType": "ParseSrcFilesPayload",
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
              v2,
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
                  v2
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
                      v3,
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  v2
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "keys",
                "storageKey": "keys(first:100000)",
                "args": v4,
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
                          v2,
                          v5,
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
                            "args": v4,
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
                                      v5,
                                      v3,
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "fuzzy",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      v2,
                                      v6,
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "translation",
                                        "args": null,
                                        "storageKey": null
                                      }
                                    ]
                                  },
                                  v7
                                ]
                              },
                              v8
                            ]
                          },
                          {
                            "kind": "LinkedHandle",
                            "alias": null,
                            "name": "translations",
                            "args": v4,
                            "handle": "connection",
                            "key": "Translator_viewer_translations",
                            "filters": null
                          },
                          {
                            "kind": "LinkedHandle",
                            "alias": null,
                            "name": "translations",
                            "args": v4,
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
                          v6
                        ]
                      },
                      v7
                    ]
                  },
                  v8
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "keys",
                "args": v4,
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
(node/*: any*/).hash = '2f77ba666849bd233d96de720007bf05';
module.exports = node;
