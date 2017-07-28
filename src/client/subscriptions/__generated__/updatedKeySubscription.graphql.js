/**
 * @flow
 * @relayHash 472bd01cc7635035ac4a508b36bebbc9
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updatedKeySubscriptionVariables = {| |};

export type updatedKeySubscriptionResponse = {|
  +updatedKey: ?{|
    +key: ?{|
      +text: string;
      +isDeleted: ?boolean;
    |};
  |};
|};
*/


/*
subscription updatedKeySubscription {
  updatedKey {
    key {
      text
      isDeleted
      id
    }
  }
}
*/

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "updatedKeySubscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedKeyPayload",
        "name": "updatedKey",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Key",
            "name": "key",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "text",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "isDeleted",
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
  "name": "updatedKeySubscription",
  "query": {
    "argumentDefinitions": [],
    "kind": "Root",
    "name": "updatedKeySubscription",
    "operation": "subscription",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": null,
        "concreteType": "UpdatedKeyPayload",
        "name": "updatedKey",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Key",
            "name": "key",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "text",
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
  "text": "subscription updatedKeySubscription {\n  updatedKey {\n    key {\n      text\n      isDeleted\n      id\n    }\n  }\n}\n"
};

module.exports = batch;
