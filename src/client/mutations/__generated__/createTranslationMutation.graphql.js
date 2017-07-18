/**
 * @flow
 * @relayHash e6b0eb9ec3c593a90e95dcafadf82dcb
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type createTranslationMutationVariables = {|
  input: {
    set?: ?{
      lang?: ?string;
      translation?: ?string;
      fuzzy?: ?boolean;
      keyId?: ?string;
    };
    unset?: ?$ReadOnlyArray<?string>;
    parentId: string;
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type createTranslationMutationResponse = {|
  +createTranslationInKeyTranslations: ?{|
    +createdTranslationEdge: ?{|
      +__typename: string;
      +cursor: string;
      +node: ?{| |};
    |};
  |};
|};
*/


/*
mutation createTranslationMutation(
  $input: CreateTranslationInKeyTranslationsInput!
) {
  createTranslationInKeyTranslations(input: $input) {
    createdTranslationEdge {
      __typename
      cursor
      node {
        ...eeTranslation_translation
        id
      }
    }
  }
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
        "type": "CreateTranslationInKeyTranslationsInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "createTranslationMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "CreateTranslationInKeyTranslationsInput!"
          }
        ],
        "concreteType": "CreateTranslationInKeyTranslationsPayload",
        "name": "createTranslationInKeyTranslations",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "TranslationEdge",
            "name": "createdTranslationEdge",
            "plural": false,
            "selections": [
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
                "name": "cursor",
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "args": null,
                "concreteType": "Translation",
                "name": "node",
                "plural": false,
                "selections": [
                  {
                    "kind": "FragmentSpread",
                    "name": "eeTranslation_translation",
                    "args": null
                  }
                ],
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
  "name": "createTranslationMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "CreateTranslationInKeyTranslationsInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "createTranslationMutation",
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
            "type": "CreateTranslationInKeyTranslationsInput!"
          }
        ],
        "concreteType": "CreateTranslationInKeyTranslationsPayload",
        "name": "createTranslationInKeyTranslations",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "TranslationEdge",
            "name": "createdTranslationEdge",
            "plural": false,
            "selections": [
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
                "name": "cursor",
                "storageKey": null
              },
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
                  }
                ],
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
  "text": "mutation createTranslationMutation(\n  $input: CreateTranslationInKeyTranslationsInput!\n) {\n  createTranslationInKeyTranslations(input: $input) {\n    createdTranslationEdge {\n      __typename\n      cursor\n      node {\n        ...eeTranslation_translation\n        id\n      }\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
