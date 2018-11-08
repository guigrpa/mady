/**
 * @flow
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteFragment } from 'relay-runtime';
import type { FragmentReference } from "relay-runtime";
declare export opaque type aeSettings_config$ref: FragmentReference;
export type aeSettings_config = {|
  +langs: $ReadOnlyArray<string>,
  +srcPaths: $ReadOnlyArray<string>,
  +srcExtensions: $ReadOnlyArray<string>,
  +msgFunctionNames: $ReadOnlyArray<string>,
  +msgRegexps: $ReadOnlyArray<string>,
  +fMinify: boolean,
  +fJsOutput: boolean,
  +fJsonOutput: boolean,
  +fReactIntlOutput: boolean,
  +$refType: aeSettings_config$ref,
|};
*/


const node/*: ConcreteFragment*/ = {
  "kind": "Fragment",
  "name": "aeSettings_config",
  "type": "Config",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "langs",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "srcPaths",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "srcExtensions",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "msgFunctionNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "msgRegexps",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fMinify",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fJsOutput",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fJsonOutput",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "fReactIntlOutput",
      "args": null,
      "storageKey": null
    }
  ]
};
// prettier-ignore
(node/*: any*/).hash = '32053060599988d5e9306e41e3a6a7b2';
module.exports = node;
