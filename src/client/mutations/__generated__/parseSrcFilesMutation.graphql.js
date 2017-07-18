/**
 * @flow
 * @relayHash 99a1238933ef1e14307e9884b9d880c8
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type parseSrcFilesMutationVariables = {|
  input: {
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type parseSrcFilesMutationResponse = {|
  +parseSrcFiles: ?{|
    +viewer: ?{| |};
  |};
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
  keys(first: 100000) {
    edges {
      node {
        id
        isDeleted
        unusedSince
        context
        text
        ...edTranslatorRow_theKey
        translations(first: 100000) {
          edges {
            node {
              lang
              id
            }
          }
        }
      }
    }
  }
  ...edTranslatorRow_viewer
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
      hasPreviousPage
      startCursor
    }
  }
}

fragment edTranslatorRow_viewer on Viewer {
  id
}

fragment eeTranslation_theKey on Key {
  id
  text
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
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "ParseSrcFilesInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "parseSrcFilesMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "ParseSrcFilesInput!"
          }
        ],
        "concreteType": "ParseSrcFilesPayload",
        "name": "parseSrcFiles",
        "plural": false,
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
                "kind": "FragmentSpread",
                "name": "adTranslator_viewer",
                "args": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "parseSrcFilesMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "ParseSrcFilesInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "parseSrcFilesMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "ParseSrcFilesInput!"
          }
        ],
        "concreteType": "ParseSrcFilesPayload",
        "name": "parseSrcFiles",
        "plural": false,
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
                                        "name": "lang",
                                        "storageKey": null
                                      },
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "args": null,
                                        "name": "translation",
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
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "hasPreviousPage",
                                    "storageKey": null
                                  },
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "args": null,
                                    "name": "startCursor",
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
                            "key": "TranslatorRow_theKey_translations",
                            "filters": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "keys{\"first\":100000}"
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation parseSrcFilesMutation(\n  $input: ParseSrcFilesInput!\n) {\n  parseSrcFiles(input: $input) {\n    viewer {\n      ...adTranslator_viewer\n      id\n    }\n  }\n}\n\nfragment adTranslator_viewer on Viewer {\n  id\n  config {\n    langs\n    id\n  }\n  keys(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        unusedSince\n        context\n        text\n        ...edTranslatorRow_theKey\n        translations(first: 100000) {\n          edges {\n            node {\n              lang\n              id\n            }\n          }\n        }\n      }\n    }\n  }\n  ...edTranslatorRow_viewer\n}\n\nfragment edTranslatorRow_theKey on Key {\n  id\n  context\n  text\n  unusedSince\n  ...eeTranslation_theKey\n  translations(first: 100000) {\n    edges {\n      node {\n        id\n        isDeleted\n        lang\n        ...eeTranslation_translation\n        __typename\n      }\n      cursor\n    }\n    pageInfo {\n      endCursor\n      hasNextPage\n      hasPreviousPage\n      startCursor\n    }\n  }\n}\n\nfragment edTranslatorRow_viewer on Viewer {\n  id\n}\n\nfragment eeTranslation_theKey on Key {\n  id\n  text\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
