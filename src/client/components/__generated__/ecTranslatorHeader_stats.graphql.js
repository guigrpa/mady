/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type ecTranslatorHeader_stats$ref: FragmentReference;
export type ecTranslatorHeader_stats = {|
  +numTotalKeys: number,
  +numUsedKeys: number,
  +numTranslations: ?$ReadOnlyArray<?{|
    +lang: string,
    +value: number,
  |}>,
  +$refType: ecTranslatorHeader_stats$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "ecTranslatorHeader_stats",
  "type": "Stats",
  "metadata": null,
  "argumentDefinitions": [],
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
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = 'd26fe4a27153078d1dafba509f76c862';
module.exports = node;
