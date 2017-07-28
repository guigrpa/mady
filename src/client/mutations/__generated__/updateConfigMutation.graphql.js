/**
 * @flow
 * @relayHash 3cbf965ee3c18ab29a78ec342484de20
 */

/* eslint-disable */

'use strict';

/*::
import type {ConcreteBatch} from 'relay-runtime';
export type updateConfigMutationVariables = {|
  input: {
    attrs?: ?{
      srcPaths?: ?$ReadOnlyArray<string>;
      srcExtensions?: ?$ReadOnlyArray<string>;
      langs?: ?$ReadOnlyArray<string>;
      msgFunctionNames?: ?$ReadOnlyArray<string>;
      msgRegexps?: ?$ReadOnlyArray<string>;
      fMinify?: ?boolean;
      fJsOutput?: ?boolean;
      fJsonOutput?: ?boolean;
      fReactIntlOutput?: ?boolean;
    };
    storyId?: ?string;
    clientMutationId?: ?string;
  };
|};

export type updateConfigMutationResponse = {|
  +updateConfig: ?{|
    +config: ?{| |};
  |};
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

const batch /*: ConcreteBatch*/ = {
  "fragment": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "UpdateConfigInput!",
        "defaultValue": null
      }
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "updateConfigMutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "UpdateConfigInput!"
          }
        ],
        "concreteType": "UpdateConfigPayload",
        "name": "updateConfig",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Config",
            "name": "config",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "aeSettings_config",
                "args": null
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation"
  },
  "id": null,
  "kind": "Batch",
  "metadata": {},
  "name": "updateConfigMutation",
  "query": {
    "argumentDefinitions": [
      {
        "kind": "LocalArgument",
        "name": "input",
        "type": "UpdateConfigInput!",
        "defaultValue": null
      }
    ],
    "kind": "Root",
    "name": "updateConfigMutation",
    "operation": "mutation",
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "args": [
          {
            "kind": "Variable",
            "name": "input",
            "variableName": "input",
            "type": "UpdateConfigInput!"
          }
        ],
        "concreteType": "UpdateConfigPayload",
        "name": "updateConfig",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Config",
            "name": "config",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "langs",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "srcPaths",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "srcExtensions",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "msgFunctionNames",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "msgRegexps",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "fMinify",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "fJsOutput",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "fJsonOutput",
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "fReactIntlOutput",
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
  "text": "mutation updateConfigMutation(\n  $input: UpdateConfigInput!\n) {\n  updateConfig(input: $input) {\n    config {\n      ...aeSettings_config\n      id\n    }\n  }\n}\n\nfragment aeSettings_config on Config {\n  langs\n  srcPaths\n  srcExtensions\n  msgFunctionNames\n  msgRegexps\n  fMinify\n  fJsOutput\n  fJsonOutput\n  fReactIntlOutput\n}\n"
};

module.exports = batch;
