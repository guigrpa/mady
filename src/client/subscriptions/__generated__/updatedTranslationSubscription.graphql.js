/**
 * @flow
 * @relayHash f3e94f41391c3393488b76cda035fc36
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updatedTranslationSubscriptionVariables = {| |};

export type updatedTranslationSubscriptionResponse = {|
  +updatedTranslation: ?{|
    +translation: ?{|
      +isDeleted: ?boolean;
    |};
  |};
|};
*/


/*
subscription updatedTranslationSubscription {
  updatedTranslation {
    translation {
      isDeleted
      ...eeTranslation_translation
      id
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
    "name": "updatedTranslationSubscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedTranslationPayload",
        "name": "updatedTranslation",
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
  "name": "updatedTranslationSubscription",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "updatedTranslationSubscription",
    "operation": "subscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedTranslationPayload",
        "name": "updatedTranslation",
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
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "subscription updatedTranslationSubscription {\n  updatedTranslation {\n    translation {\n      isDeleted\n      ...eeTranslation_translation\n      id\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n"
};

module.exports = batch;
