/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type eeTranslation_theKey$ref = any;
type eeTranslation_translation$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type edTranslatorRow_theKey$ref: FragmentReference;
export type edTranslatorRow_theKey = {|
  +id: string,
  +context: ?string,
  +text: string,
  +unusedSince: ?string,
  +translations: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +isDeleted: ?boolean,
        +lang: string,
        +$fragmentRefs: eeTranslation_translation$ref,
      |}
    |}>
  |},
  +$fragmentRefs: eeTranslation_theKey$ref,
  +$refType: edTranslatorRow_theKey$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "edTranslatorRow_theKey",
  "type": "Key",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "translations"
        ]
      }
    ]
  },
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "context",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "text",
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
      "kind": "FragmentSpread",
      "name": "eeTranslation_theKey",
      "args": null
    },
    {
      "kind": "LinkedField",
      "alias": "translations",
      "name": "__TranslatorRow_theKey_translations_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "TranslationConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "TranslationEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
              "storageKey": null,
              "args": null,
              "concreteType": "Translation",
              "plural": false,
              "selections": [
                v0,
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "isDeleted",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "lang",
                  "args": null,
                  "storageKey": null
                },
                {
                  "kind": "FragmentSpread",
                  "name": "eeTranslation_translation",
                  "args": null
                },
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "__typename",
                  "args": null,
                  "storageKey": null
                }
              ]
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "cursor",
              "args": null,
              "storageKey": null
            }
          ]
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "pageInfo",
          "storageKey": null,
          "args": null,
          "concreteType": "PageInfo",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "endCursor",
              "args": null,
              "storageKey": null
            },
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "hasNextPage",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'de3313895a1934cc4871d4b070e035f5';
module.exports = node;
