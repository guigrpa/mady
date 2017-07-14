/**
 * @flow
 * @relayHash 1284b5d3848340b64adfcf6a78d91bef
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updateTranslationMutationVariables = {|
  input: {
    id: string;
    set?: ?{
      translation?: ?string;
      fuzzy?: ?boolean;
    };
    unset?: ?$ReadOnlyArray<?string>;
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type updateTranslationMutationResponse = {|
  +updateTranslation: ?{|
    +translation: ?{|
      +translation: ?string;
      +fuzzy: ?boolean;
    |};
  |};
|};
*/


/*
mutation updateTranslationMutation(
  $input: UpdateTranslationInput!
) {
  updateTranslation(input: $input) {
    translation {
      translation
      fuzzy
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
        "type": "UpdateTranslationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateTranslationMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "UpdateTranslationInput!"
          }
        ],
        "concreteType": "UpdateTranslationPayload",
        "name": "updateTranslation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Translation",
            "name": "translation",
            "plural": false,
            "selections": [
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
  "name": "updateTranslationMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "UpdateTranslationInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "updateTranslationMutation",
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
            "type": "UpdateTranslationInput!"
          }
        ],
        "concreteType": "UpdateTranslationPayload",
        "name": "updateTranslation",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Translation",
            "name": "translation",
            "plural": false,
            "selections": [
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
  "text": "mutation updateTranslationMutation(\n  $input: UpdateTranslationInput!\n) {\n  updateTranslation(input: $input) {\n    translation {\n      translation\n      fuzzy\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
