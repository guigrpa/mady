/**
 * @flow
 * @relayHash 2401f93a420cc8811717e9c0d354a94a
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type deleteTranslationMutationVariables = {|
  input: {
    id: string;
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type deleteTranslationMutationResponse = {|
  +deleteTranslation: ?{|
    +deletedTranslationId: ?string;
  |};
|};
*/


/*
mutation deleteTranslationMutation(
  $input: DeleteTranslationInput!
) {
  deleteTranslation(input: $input) {
    deletedTranslationId
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "DeleteTranslationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteTranslationMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "DeleteTranslationInput!"
          }
        ],
        "concreteType": "DeleteTranslationPayload",
        "name": "deleteTranslation",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "deletedTranslationId",
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
  "name": "deleteTranslationMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "DeleteTranslationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "deleteTranslationMutation",
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
            "type": "DeleteTranslationInput!"
          }
        ],
        "concreteType": "DeleteTranslationPayload",
        "name": "deleteTranslation",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "args": null,
            "name": "deletedTranslationId",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation deleteTranslationMutation(\n  $input: DeleteTranslationInput!\n) {\n  deleteTranslation(input: $input) {\n    deletedTranslationId\n  }\n}\n"
};

module.exports = batch;
