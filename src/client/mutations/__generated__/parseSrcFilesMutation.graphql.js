/**
 * @flow
 * @relayHash 95dc1730b21048f17d69e5f425f3fd83
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
    +viewer: ?{|
      +keys: ?{|
        +edges: ?$ReadOnlyArray<?{|
          +node: ?{|
            +id: string;
            +unusedSince: ?string;
          |};
        |}>;
      |};
    |};
  |};
|};
*/


/*
mutation parseSrcFilesMutation(
  $input: ParseSrcFilesInput!
) {
  parseSrcFiles(input: $input) {
    viewer {
      keys(first: 100000) {
        edges {
          node {
            id
            unusedSince
          }
        }
      }
      id
    }
  }
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
                            "name": "unusedSince",
                            "storageKey": null
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
                            "name": "unusedSince",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "keys{\"first\":100000}"
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation parseSrcFilesMutation(\n  $input: ParseSrcFilesInput!\n) {\n  parseSrcFiles(input: $input) {\n    viewer {\n      keys(first: 100000) {\n        edges {\n          node {\n            id\n            unusedSince\n          }\n        }\n      }\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
