import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const createdKey = ({ viewerId }) => ({
  subscription: graphql`
    subscription createdKeySubscription($parentId: ID!) {
      createdKeyInViewerKeys(parentId: $parentId) {
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
  variables: { parentId: viewerId },
  updater: store => {
    const payload = store.getRootField('createdKeyInViewerKeys');
    const keyEdge = payload.getLinkedRecord('createdKeyEdge');
    const viewerProxy = store.get(viewerId);
    ConnectionHandler.insertEdgeAfter(
      ConnectionHandler.getConnection(viewerProxy, 'Translator_viewer_keys'),
      keyEdge
    );
    ConnectionHandler.insertEdgeAfter(
      ConnectionHandler.getConnection(
        viewerProxy,
        'TranslatorHeader_viewer_keys'
      ),
      keyEdge
    );
  },
});

export default createdKey;
