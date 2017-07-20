/**
 * @flow
 * @relayHash e7cdf209e516f2acd07174f905f4974e
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updateKeyMutationVariables = {|
  input: {
    id: string;
    attrs?: ?{
      isDeleted?: ?boolean;
      context?: ?string;
      text?: ?string;
      firstUsed?: ?string;
      unusedSince?: ?string;
    };
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type updateKeyMutationResponse = {|
  +updateKey: ?{|
    +key: ?{|
      +isDeleted: ?boolean;
    |};
  |};
|};
*/


/*
mutation updateKeyMutation(
  $input: UpdateKeyInput!
) {
  updateKey(input: $input) {
    key {
      isDeleted
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
        "type": "UpdateKeyInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateKeyMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "UpdateKeyInput!"
          }
        ],
        "concreteType": "UpdateKeyPayload",
        "name": "updateKey",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Key",
            "name": "key",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "isDeleted",
                "storageKey": null
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
  "name": "updateKeyMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "UpdateKeyInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "updateKeyMutation",
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
            "type": "UpdateKeyInput!"
          }
        ],
        "concreteType": "UpdateKeyPayload",
        "name": "updateKey",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Key",
            "name": "key",
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
  "text": "mutation updateKeyMutation(\n  $input: UpdateKeyInput!\n) {\n  updateKey(input: $input) {\n    key {\n      isDeleted\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
