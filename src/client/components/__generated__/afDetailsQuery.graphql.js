/**
 * @flow
 * @relayHash 0f005d08a494992b93003fd68def8e4d
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
export type afDetailsQueryVariables = {|
  selectedKeyId: string
|};
export type afDetailsQueryResponse = {|
  +node: ?{|
    +firstUsed?: string,
    +unusedSince?: ?string,
    +description?: ?string,
    +sources?: $ReadOnlyArray<string>,
  |}
|};
export type afDetailsQuery = {|
  variables: afDetailsQueryVariables,
  response: afDetailsQueryResponse,
|};
*/


/*
query afDetailsQuery(
  $selectedKeyId: ID!
) {
  node(id: $selectedKeyId) {
    __typename
    ... on Key {
      firstUsed
      unusedSince
      description
      sources
    }
    id
  }
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "selectedKeyId",
    "type": "ID!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "selectedKeyId",
    "type": "ID!"
  }
],
v2 = {
  "kind": "InlineFragment",
  "type": "Key",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "firstUsed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "unusedSince",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "sources",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "afDetailsQuery",
  "id": null,
  "text": "query afDetailsQuery(\n  $selectedKeyId: ID!\n) {\n  node(id: $selectedKeyId) {\n    __typename\n    ... on Key {\n      firstUsed\n      unusedSince\n      description\n      sources\n    }\n    id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "afDetailsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "afDetailsQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "node",
        "storageKey": null,
        "args": v1,
        "concreteType": null,
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "__typename",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          v2
        ]
      }
    ]
  }
};
})();
// prettier-ignore
(node/*: any*/).hash = '8fcfa9182120be66deebc768ad9d28f3';
module.exports = node;
