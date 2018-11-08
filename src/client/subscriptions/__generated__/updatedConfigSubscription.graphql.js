/**
 * @flow
 * @relayHash f634e3e07a8643b7b334c9202cd34cef
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type aeSettings_config$ref = any;
export type updatedConfigSubscriptionVariables = {||};
export type updatedConfigSubscriptionResponse = {|
  +updatedConfig: ?{|
    +config: ?{|
      +$fragmentRefs: aeSettings_config$ref
    |}
  |}
|};
export type updatedConfigSubscription = {|
  variables: updatedConfigSubscriptionVariables,
  response: updatedConfigSubscriptionResponse,
|};
*/


/*
subscription updatedConfigSubscription {
  updatedConfig {
    config {
      ...aeSettings_config
      id
    }
  }
}

fragment aeSettings_config on Config {
  langs
  srcPaths
  srcExtensions
  msgFunctionNames
  msgRegexps
  fMinify
  fJsOutput
  fJsonOutput
  fReactIntlOutput
}
*/

const node/*: ConcreteRequest*/ = {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "updatedConfigSubscription",
  "id": null,
  "text": "subscription updatedConfigSubscription {\n  updatedConfig {\n    config {\n      ...aeSettings_config\n      id\n    }\n  }\n}\n\nfragment aeSettings_config on Config {\n  langs\n  srcPaths\n  srcExtensions\n  msgFunctionNames\n  msgRegexps\n  fMinify\n  fJsOutput\n  fJsonOutput\n  fReactIntlOutput\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updatedConfigSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedConfig",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedConfigPayload",
        "plural": false,
        "selections": [
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
                "kind": "FragmentSpread",
                "name": "aeSettings_config",
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
    "name": "updatedConfigSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedConfig",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedConfigPayload",
        "plural": false,
        "selections": [
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
(node/*: any*/).hash = '9313e0b4846ce9243d554514e33add03';
module.exports = node;
