// import { graphql } from 'react-relay';
// // import { ConnectionHandler } from 'relay-runtime';
//
// const createdKey = () => ({
//   subscription: graphql`
//     subscription createdKeySubscription {
//       createdKeyInViewerKeys {
//         viewer {
//           ...adTranslator_viewer
//         }
//       }
//     }
//   `,
//   // updater: store => {
//   //   const payload = store.getRootField('createdKeyInViewerKeys');
//   //   const keyEdge = payload.getLinkedRecord('createdKeyEdge');
//   //   const viewerProxy = store.get(viewerId);
//   //   ConnectionHandler.insertEdgeAfter(
//   //     ConnectionHandler.getConnection(viewerProxy, 'Translator_viewer_keys'),
//   //     keyEdge
//   //   );
//   // },
// });
//
// export default createdKey;
