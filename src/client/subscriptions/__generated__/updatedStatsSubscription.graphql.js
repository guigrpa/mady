/**
 * @flow
 * @relayHash 1819c0878647afa6d3e0ea39493035ac
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ecTranslatorHeader_stats$ref = any;
export type updatedStatsSubscriptionVariables = {||};
export type updatedStatsSubscriptionResponse = {|
  +updatedStats: ?{|
    +stats: ?{|
      +$fragmentRefs: ecTranslatorHeader_stats$ref
    |}
  |}
|};
export type updatedStatsSubscription = {|
  variables: updatedStatsSubscriptionVariables,
  response: updatedStatsSubscriptionResponse,
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

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "updatedStatsSubscription",
  "id": null,
  "text": "subscription updatedStatsSubscription {\n  updatedStats {\n    stats {\n      ...ecTranslatorHeader_stats\n      id\n    }\n  }\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updatedStatsSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedStats",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedStatsPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "stats",
            "storageKey": null,
            "args": null,
            "concreteType": "Stats",
            "plural": false,
            "selections": [
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
    "name": "updatedStatsSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedStats",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedStatsPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "stats",
            "storageKey": null,
            "args": null,
            "concreteType": "Stats",
            "plural": false,
            "selections": [
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
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "lang",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "value",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  }
};
// prettier-ignore
(node/*: any*/).hash = 'cdacbdfe5bb6f5497bc5abf35152d164';
module.exports = node;
