import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const createdKey = ({ viewerId }) => ({
  subscription: graphql`
    subscription createdKeySubscription {
      createdKeyInViewerKeys {
        createdKeyEdge {
          node {
            id
            isDeleted
            unusedSince
            context
            text # for sorting
            translations(first: 100000)
              @connection(key: "Translator_viewer_translations") {
              edges {
                node {
                  isDeleted
                  lang
                  fuzzy
                }
              }
            }
            ...edTranslatorRow_theKey
          }
        }
      }
    }
  `,
  updater: store => {
    const payload = store.getRootField('createdKeyInViewerKeys');
    const keyEdge = payload.getLinkedRecord('createdKeyEdge');
    const viewerProxy = store.get(viewerId);
    ConnectionHandler.insertEdgeAfter(
      ConnectionHandler.getConnection(viewerProxy, 'Translator_viewer_keys'),
      keyEdge
    );
  },
});

export default createdKey;
