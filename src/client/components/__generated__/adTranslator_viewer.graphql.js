/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
type ecTranslatorHeader_stats$ref = any;
type edTranslatorRow_theKey$ref = any;
import type { FragmentReference } from "relay-runtime";
declare export opaque type adTranslator_viewer$ref: FragmentReference;
export type adTranslator_viewer = {|
  +id: string,
  +config: {|
    +langs: $ReadOnlyArray<string>
  |},
  +stats: {|
    +$fragmentRefs: ecTranslatorHeader_stats$ref
  |},
  +keys: ?{|
    +edges: ?$ReadOnlyArray<?{|
      +node: ?{|
        +id: string,
        +isDeleted: ?boolean,
        +unusedSince: ?string,
        +context: ?string,
        +text: string,
        +translations: ?{|
          +edges: ?$ReadOnlyArray<?{|
            +node: ?{|
              +isDeleted: ?boolean,
              +lang: string,
              +fuzzy: ?boolean,
            |}
          |}>
        |},
        +$fragmentRefs: edTranslatorRow_theKey$ref,
      |}
    |}>
  |},
  +$refType: adTranslator_viewer$ref,
|};
*/


const node/*: ConcreteFragment*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v4 = {
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
};
return {
  "kind": "Fragment",
  "name": "adTranslator_viewer",
  "type": "Viewer",
  "metadata": {
    "connection": [
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": null
      },
      {
        "count": null,
        "cursor": null,
        "direction": "forward",
        "path": [
          "keys"
        ]
      }
    ]
  },
  "argumentDefinitions": [],
  "selections": [
    v0,
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "config",
      "storageKey": null,
      "args": null,
      "concreteType": "Config",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "langs",
          "args": null,
          "storageKey": null
        }
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
        {
          "kind": "FragmentSpread",
          "name": "ecTranslatorHeader_stats",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "keys",
      "name": "__Translator_viewer_keys_connection",
      "storageKey": null,
      "args": null,
      "concreteType": "KeyConnection",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "edges",
          "storageKey": null,
          "args": null,
          "concreteType": "KeyEdge",
          "plural": true,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "node",
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
                  "name": "unusedSince",
                  "args": null,
                  "storageKey": null
                },
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
                  "kind": "LinkedField",
                  "alias": "translations",
                  "name": "__Translator_viewer_translations_connection",
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
                            v1,
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
                              "name": "fuzzy",
                              "args": null,
                              "storageKey": null
                            },
                            v2
                          ]
                        },
                        v3
                      ]
                    },
                    v4
                  ]
                },
                {
                  "kind": "FragmentSpread",
                  "name": "edTranslatorRow_theKey",
                  "args": null
                },
                v2
              ]
            },
            v3
          ]
        },
        v4
      ]
    }
  ]
};
})();
// prettier-ignore
(node/*: any*/).hash = 'cebc4227005f0f874ab4e0e08258e698';
module.exports = node;
