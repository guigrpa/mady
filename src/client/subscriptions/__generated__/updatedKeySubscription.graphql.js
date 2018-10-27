/**
 * @flow
 * @relayHash e6c86c888556d71a36870b5c297935ab
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type updatedKeySubscriptionVariables = {||};
export type updatedKeySubscriptionResponse = {|
  +updatedKey: ?{|
    +key: ?{|
      +text: string,
      +isDeleted: ?boolean,
    |}
  |}
|};
export type updatedKeySubscription = {|
  variables: updatedKeySubscriptionVariables,
  response: updatedKeySubscriptionResponse,
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

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "text",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "updatedKeySubscription",
  "id": null,
  "text": "subscription updatedKeySubscription {\n  updatedKey {\n    key {\n      text\n      isDeleted\n      id\n    }\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updatedKeySubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedKey",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedKeyPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "key",
            "storageKey": null,
            "args": null,
            "concreteType": "Key",
            "plural": false,
            "selections": [
              v0,
              v1
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "updatedKeySubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedKey",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedKeyPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "key",
            "storageKey": null,
            "args": null,
            "concreteType": "Key",
            "plural": false,
            "selections": [
              v0,
              v1,
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
})();
// prettier-ignore
(node/*: any*/).hash = '481dca79d075e1847c0b685dd6001d23';
module.exports = node;
