/**
 * @flow
 * @relayHash a601359d0100d5b6fc3a8e46150638e3
 */

/* eslint-disable */

'use strict';

/*::
import type { ConcreteRequest } from 'relay-runtime';
type eeTranslation_translation$ref = any;
export type updatedTranslationSubscriptionVariables = {||};
export type updatedTranslationSubscriptionResponse = {|
  +updatedTranslation: ?{|
    +translation: ?{|
      +isDeleted: ?boolean,
      +$fragmentRefs: eeTranslation_translation$ref,
    |}
  |}
|};
export type updatedTranslationSubscription = {|
  variables: updatedTranslationSubscriptionVariables,
  response: updatedTranslationSubscriptionResponse,
|};
*/


/*
subscription updatedTranslationSubscription {
  updatedTranslation {
    translation {
      isDeleted
      ...eeTranslation_translation
      id
    }
  }
}

fragment eeTranslation_translation on Translation {
  id
  isDeleted
  lang
  translation
  fuzzy
}
*/

const node/*: ConcreteRequest*/ = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isDeleted",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "subscription",
  "name": "updatedTranslationSubscription",
  "id": null,
  "text": "subscription updatedTranslationSubscription {\n  updatedTranslation {\n    translation {\n      isDeleted\n      ...eeTranslation_translation\n      id\n    }\n  }\n}\n\nfragment eeTranslation_translation on Translation {\n  id\n  isDeleted\n  lang\n  translation\n  fuzzy\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "updatedTranslationSubscription",
    "type": "Subscription",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedTranslation",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedTranslationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "translation",
            "storageKey": null,
            "args": null,
            "concreteType": "Translation",
            "plural": false,
            "selections": [
              v0,
              {
                "kind": "FragmentSpread",
                "name": "eeTranslation_translation",
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
    "name": "updatedTranslationSubscription",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "updatedTranslation",
        "storageKey": null,
        "args": null,
        "concreteType": "UpdatedTranslationPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "translation",
            "storageKey": null,
            "args": null,
            "concreteType": "Translation",
            "plural": false,
            "selections": [
              v0,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
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
                "kind": "ScalarField",
                "alias": null,
                "name": "translation",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "fuzzy",
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
})();
// prettier-ignore
(node/*: any*/).hash = '4a4ae750806d3e3de00530b8eea3a79a';
module.exports = node;
