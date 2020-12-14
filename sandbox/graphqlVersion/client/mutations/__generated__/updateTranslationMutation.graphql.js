/**
 * @flow
 * @relayHash 982562aba099fcefa8d42a871262626b
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updateTranslationMutationVariables = {|
  input: {
    id: string;
    attrs?: ?{
      isDeleted?: ?boolean;
      translation?: ?string;
      fuzzy?: ?boolean;
    };
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type updateTranslationMutationResponse = {|
  +updateTranslation: ?{|
    +translation: ?{|
      +isDeleted: ?boolean;
    |};
    +stats: {|
      +id: string;
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
                "name": "isDeleted",
                "storageKey": null
              },
              {
                "kind": "FragmentSpread",
                "name": "eeTranslation_translation",
                "args": null
              }
            ],
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
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
                "kind": "FragmentSpread",
                "name": "ecTranslatorHeader_stats",
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
                "name": "isDeleted",
                "storageKey": null
              },
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
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
                "kind": "InlineFragment",
                "type": "Stats",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numTotalKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numUsedKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "StatsForLang",
                    "name": "numTranslations",
                    "plural": true,
                    "selections": [
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
                        "name": "value",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation updateTranslationMutation(\n  $input: UpdateTranslationInput!\n) {\n  updateTranslation(input: $input) {\n    translation {\n      isDeleted\n      ...eeTranslation_translation\n      id\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n"
};

module.exports = batch;
