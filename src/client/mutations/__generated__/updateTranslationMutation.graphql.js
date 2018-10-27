/**
 * @flow
 * @relayHash 1a0861f04a1dc1adfdeb2e7a77fa0d22
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ecTranslatorHeader_stats$ref = any;
type eeTranslation_translation$ref = any;
export type UpdateTranslationInput = {
  id: string,
  attrs?: ?TranslationUpdate,
  storyId?: ?string,
  clientMutationId?: ?string,
};
export type TranslationUpdate = {
  isDeleted?: ?boolean,
  translation?: ?string,
  fuzzy?: ?boolean,
};
export type updateTranslationMutationVariables = {|
  input: UpdateTranslationInput
|};
export type updateTranslationMutationResponse = {|
  +updateTranslation: ?{|
    +translation: ?{|
      +isDeleted: ?boolean,
      +$fragmentRefs: eeTranslation_translation$ref,
    |},
    +stats: {|
      +id: string,
      +$fragmentRefs: ecTranslatorHeader_stats$ref,
    |},
  |}
|};
export type updateTranslationMutation = {|
  variables: updateTranslationMutationVariables,
  response: updateTranslationMutationResponse,
|};
*/


/*
mutation updateTranslationMutation(
  $input: UpdateTranslationInput!
) {
  updateTranslation(input: $input) {
    translation {
      isDeleted
      ...eeTranslation_translation
      id
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
    "type": "UpdateTranslationInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateTranslationInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "lang",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "updateTranslationMutation",
  "id": null,
  "text": "mutation updateTranslationMutation(\n  $input: UpdateTranslationInput!\n) {\n  updateTranslation(input: $input) {\n    translation {\n      isDeleted\n      ...eeTranslation_translation\n      id\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updateTranslationMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateTranslation",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateTranslationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "translation",
            "storageKey": null,
            "args": null,
            "concreteType": "Translation",
            "plural": false,
            "selections": [
              v2,
              {
                "kind": "FragmentSpread",
                "name": "eeTranslation_translation",
                "args": null
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
              v3,
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
    "name": "updateTranslationMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateTranslation",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateTranslationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "translation",
            "storageKey": null,
            "args": null,
            "concreteType": "Translation",
            "plural": false,
            "selections": [
              v2,
              v3,
              v4,
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
              v3,
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
                  v4,
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
(node/*: any*/).hash = '783d4b4d4ca03c0b8a0c3c9b0f8ee139';
module.exports = node;
