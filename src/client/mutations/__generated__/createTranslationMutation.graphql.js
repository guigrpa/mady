/**
 * @flow
 * @relayHash 6a7b18fbbf69a1bc9c0daae37fabeb1a
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type createTranslationMutationVariables = {|
  input: {
    attrs?: ?{
      lang: string;
      translation: string;
      fuzzy?: ?boolean;
      keyId: string;
    };
    parentId: string;
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type createTranslationMutationResponse = {|
  +createTranslationInKeyTranslations: ?{|
    +createdTranslationEdge: ?{|
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
  "text": "mutation createTranslationMutation(\n  $input: CreateTranslationInKeyTranslationsInput!\n) {\n  createTranslationInKeyTranslations(input: $input) {\n    createdTranslationEdge {\n      node {\n        ...eeTranslation_translation\n        id\n      }\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
