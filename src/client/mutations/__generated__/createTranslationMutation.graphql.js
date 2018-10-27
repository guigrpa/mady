/**
 * @flow
 * @relayHash a3288261f9371fa660c786fc5f7d4ca7
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ecTranslatorHeader_stats$ref = any;
type eeTranslation_translation$ref = any;
export type CreateTranslationInKeyTranslationsInput = {
  attrs?: ?TranslationCreate,
  parentId: string,
  storyId?: ?string,
  clientMutationId?: ?string,
};
export type TranslationCreate = {
  lang: string,
  translation: string,
  fuzzy?: ?boolean,
  keyId: string,
};
export type createTranslationMutationVariables = {|
  input: CreateTranslationInKeyTranslationsInput
|};
export type createTranslationMutationResponse = {|
  +createTranslationInKeyTranslations: ?{|
    +createdTranslationEdge: ?{|
      +node: ?{|
        +$fragmentRefs: eeTranslation_translation$ref
      |}
    |},
    +stats: {|
      +id: string,
      +$fragmentRefs: ecTranslatorHeader_stats$ref,
    |},
  |}
|};
export type createTranslationMutation = {|
  variables: createTranslationMutationVariables,
  response: createTranslationMutationResponse,
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
    stats {
      id
      ...ecTranslatorHeader_stats
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

fragment ecTranslatorHeader_stats on Stats {
  numTotalKeys
  numUsedKeys
  numTranslations {
    lang
    value
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "CreateTranslationInKeyTranslationsInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "CreateTranslationInKeyTranslationsInput!"
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
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "createTranslationMutation",
  "id": null,
  "text": "mutation createTranslationMutation(\n  $input: CreateTranslationInKeyTranslationsInput!\n) {\n  createTranslationInKeyTranslations(input: $input) {\n    createdTranslationEdge {\n      node {\n        ...eeTranslation_translation\n        id\n      }\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "createTranslationMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createTranslationInKeyTranslations",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateTranslationInKeyTranslationsPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "createdTranslationEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "TranslationEdge",
            "plural": false,
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
                  {
                    "kind": "FragmentSpread",
                    "name": "eeTranslation_translation",
                    "args": null
                  }
                ]
              }
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
              v2,
              {
                "kind": "FragmentSpread",
                "name": "ecTranslatorHeader_stats",
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
    "name": "createTranslationMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "createTranslationInKeyTranslations",
        "storageKey": null,
        "args": v1,
        "concreteType": "CreateTranslationInKeyTranslationsPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "createdTranslationEdge",
            "storageKey": null,
            "args": null,
            "concreteType": "TranslationEdge",
            "plural": false,
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
                  v2,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "isDeleted",
                    "args": null,
                    "storageKey": null
                  },
                  v3,
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "translation",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "fuzzy",
                    "args": null,
                    "storageKey": null
                  }
                ]
              }
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
              v2,
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
(node/*: any*/).hash = '870633cd642f1bbe060f026e76600847';
module.exports = node;
