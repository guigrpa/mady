/**
 * @flow
 * @relayHash 7431e97408ea80e005b52c6c3ffaabdd
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
    +stats: {|
      +id: string;
    |};
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "FragmentSpread",
                "name": "ecTranslatorHeader_stats",
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
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "args": null,
            "concreteType": "Stats",
            "name": "stats",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "args": null,
                "name": "id",
                "storageKey": null
              },
              {
                "kind": "InlineFragment",
                "type": "Stats",
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numTotalKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "args": null,
                    "name": "numUsedKeys",
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "args": null,
                    "concreteType": "StatsForLang",
                    "name": "numTranslations",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "lang",
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "args": null,
                        "name": "value",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ]
              }
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "text": "mutation updateConfigMutation(\n  $input: UpdateConfigInput!\n) {\n  updateConfig(input: $input) {\n    config {\n      ...aeSettings_config\n      id\n    }\n    stats {\n      id\n      ...ecTranslatorHeader_stats\n    }\n  }\n}\n\nfragment aeSettings_config on Config {\n  langs\n  srcPaths\n  srcExtensions\n  msgFunctionNames\n  msgRegexps\n  fMinify\n  fJsOutput\n  fJsonOutput\n  fReactIntlOutput\n}\n\nfragment ecTranslatorHeader_stats on Stats {\n  numTotalKeys\n  numUsedKeys\n  numTranslations {\n    lang\n    value\n  }\n}\n"
};

module.exports = batch;
