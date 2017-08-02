/**
 * @flow
 * @relayHash 72e82cf03844b3f4649370d4ae147438
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updatedStatsSubscriptionVariables = {| |};

export type updatedStatsSubscriptionResponse = {|
  +updatedStats: ?{|
    +stats: ?{| |};
  |};
|};
*/


/*
subscription updatedStatsSubscription {
  updatedStats {
    stats {
      ...ecTranslatorHeader_stats
      id
    }
  }
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
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatedStatsSubscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedStatsPayload",
        "name": "updatedStats",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
            "plural": false,
            "selections": [
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
    "type": "Subscription"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "updatedStatsSubscription",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "updatedStatsSubscription",
    "operation": "subscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedStatsPayload",
        "name": "updatedStats",
        "plural": false,
        "selections": [
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
  "text": "subscription updatedStatsSubscription {\n  updatedStats {\n    stats {\n      ...ecTranslatorHeader_stats\n      id\n    }\n  }\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n"
};

module.exports = batch;
