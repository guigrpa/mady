/**
 * @flow
 * @relayHash d6a172f16bd7a433414065491ed2b175
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type createdTranslationSubscriptionVariables = {| |};

export type createdTranslationSubscriptionResponse = {|
  +createdTranslationInKeyTranslations: ?{|
    +createdTranslationEdge: ?{|
      +node: ?{|
        +keyId: string;
      |};
    |};
  |};
|};
*/


/*
subscription createdTranslationSubscription {
  createdTranslationInKeyTranslations {
    createdTranslationEdge {
      node {
        keyId
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "createdTranslationSubscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "CreatedTranslationInKeyTranslationsPayload",
        "name": "createdTranslationInKeyTranslations",
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
                    "name": "keyId",
                    "storageKey": null
                  },
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
    "type": "Subscription"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "createdTranslationSubscription",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "createdTranslationSubscription",
    "operation": "subscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "CreatedTranslationInKeyTranslationsPayload",
        "name": "createdTranslationInKeyTranslations",
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
                    "name": "keyId",
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
  "text": "subscription createdTranslationSubscription {\n  createdTranslationInKeyTranslations {\n    createdTranslationEdge {\n      node {\n        keyId\n        ...eeTranslation_translation\n        id\n      }\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
