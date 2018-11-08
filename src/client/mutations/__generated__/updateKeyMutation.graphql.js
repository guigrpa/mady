/**
 * @flow
 * @relayHash 851ec1918e729a32470f0cb627251f9f
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type ecTranslatorHeader_stats$ref = any;
export type UpdateKeyInput = {
  id: string,
  attrs?: ?KeyUpdate,
  storyId?: ?string,
  clientMutationId?: ?string,
};
export type KeyUpdate = {
  isDeleted?: ?boolean,
  context?: ?string,
  text?: ?string,
  firstUsed?: ?string,
  unusedSince?: ?string,
};
export type updateKeyMutationVariables = {|
  input: UpdateKeyInput
|};
export type updateKeyMutationResponse = {|
  +updateKey: ?{|
    +key: ?{|
      +isDeleted: ?boolean
    |},
    +stats: {|
      +id: string,
      +$fragmentRefs: ecTranslatorHeader_stats$ref,
    |},
  |}
|};
export type updateKeyMutation = {|
  variables: updateKeyMutationVariables,
  response: updateKeyMutationResponse,
|};
*/


/*
mutation updateKeyMutation(
  $input: UpdateKeyInput!
) {
  updateKey(input: $input) {
    key {
      isDeleted
      id
    }
    stats {
      id
      ...ecTranslatorHeader_stats
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

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "UpdateKeyInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateKeyInput!"
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
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "updateKeyMutation",
  "id": null,
  "text": "mutation updateKeyMutation(\n  $input: UpdateKeyInput!\n) {\n  updateKey(input: $input) {\n    key {\n      isDeleted\n      id\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updateKeyMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateKey",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateKeyPayload",
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
              v2
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
    "name": "updateKeyMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateKey",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateKeyPayload",
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
              v2,
              v3
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
(node/*: any*/).hash = 'a88a73e9f2d575dd4c6e4a33c1fc3416';
module.exports = node;
