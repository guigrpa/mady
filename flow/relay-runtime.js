// export type ConcreteBatch = any;
// export type ConcreteFragment = any;
//
// export default {};
//
// Some workarounds...

declare module 'relay-runtime' {
  // Public API values
  declare var Environment: any;
  declare var Network: any;
  declare var RecordSource: any;
  declare var Store: any;

  declare var areEqualSelectors: any;
  declare var createFragmentSpecResolver: any;
  declare var createOperationSelector: any;
  declare var getDataIDsFromObject: any;
  declare var getFragment: any;
  declare var getOperation: any;
  declare var getSelector: any;
  declare var getSelectorList: any;
  declare var getSelectorsFromObject: any;
  declare var getVariablesFromObject: any;
  declare var graphql: any;

  declare var ConnectionHandler: any;
  declare var ViewerHandler: any;

  declare var commitLocalUpdate: any;
  declare var commitMutation: any;
  declare var fetchQuery: any;
  declare var isRelayStaticEnvironment: any;
  declare var requestSubscription: any;

  // Until these packages properly export Flow types, this is the minimal set-up
  // required to stop the exported types in the __generated__ artifacts from
  // being invisible to Flow. See:
  // - https://github.com/facebook/relay/issues/1689
  // - https://github.com/facebook/relay/issues/1758
  declare type ConcreteFragment = any;
  declare type ConcreteBatch = any;
}
