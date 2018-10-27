/**
 * @flow
 * @relayHash 7c8a8cf9d39a66fd60b4621893022636
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type aeSettings_config$ref = any;
type ecTranslatorHeader_stats$ref = any;
export type UpdateConfigInput = {
  attrs?: ?ConfigUpdate,
  storyId?: ?string,
  clientMutationId?: ?string,
};
export type ConfigUpdate = {
  srcPaths?: ?$ReadOnlyArray<string>,
  srcExtensions?: ?$ReadOnlyArray<string>,
  langs?: ?$ReadOnlyArray<string>,
  msgFunctionNames?: ?$ReadOnlyArray<string>,
  msgRegexps?: ?$ReadOnlyArray<string>,
  fMinify?: ?boolean,
  fJsOutput?: ?boolean,
  fJsonOutput?: ?boolean,
  fReactIntlOutput?: ?boolean,
};
export type updateConfigMutationVariables = {|
  input: UpdateConfigInput
|};
export type updateConfigMutationResponse = {|
  +updateConfig: ?{|
    +config: ?{|
      +$fragmentRefs: aeSettings_config$ref
    |},
    +stats: {|
      +id: string,
      +$fragmentRefs: ecTranslatorHeader_stats$ref,
    |},
  |}
|};
export type updateConfigMutation = {|
  variables: updateConfigMutationVariables,
  response: updateConfigMutationResponse,
|};
*/


/*
mutation updateConfigMutation(
  $input: UpdateConfigInput!
) {
  updateConfig(input: $input) {
    config {
      ...aeSettings_config
      id
    }
    stats {
      id
      ...ecTranslatorHeader_stats
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
    "type": "UpdateConfigInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input",
    "type": "UpdateConfigInput!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "mutation",
  "name": "updateConfigMutation",
  "id": null,
  "text": "mutation updateConfigMutation(\n  $input: UpdateConfigInput!\n) {\n  updateConfig(input: $input) {\n    config {\n      ...aeSettings_config\n      id\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment aeSettings_config on Config {\n  langs\n  srcPaths\n  srcExtensions\n  msgFunctionNames\n  msgRegexps\n  fMinify\n  fJsOutput\n  fJsonOutput\n  fReactIntlOutput\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updateConfigMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConfig",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateConfigPayload",
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
              v2,
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
    "name": "updateConfigMutation",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updateConfig",
        "storageKey": null,
        "args": v1,
        "concreteType": "UpdateConfigPayload",
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
              v2,
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
(node/*: any*/).hash = '28918a746f696434674de418329b1ece';
module.exports = node;
