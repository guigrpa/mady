import { graphql } from 'react-relay';
// import { ConnectionHandler } from 'relay-runtime';

// const sharedUpdater = (store, theKey, translationEdge) => {
//   const keyProxy = store.get(theKey.id);
//   const conn = ConnectionHandler.getConnection(
//     keyProxy,
//     'TranslatorRow_theKey_translations'
//   );
//   ConnectionHandler.insertEdgeAfter(conn, translationEdge);
// };
//
const createTranslation = ({ theKey, attrs }) => ({
  mutation: graphql`
    mutation createTranslationMutation(
      $input: CreateTranslationInKeyTranslationsInput!
    ) {
      createTranslationInKeyTranslations(input: $input) {
        createdTranslationEdge {
          node {
            ...eeTranslation_translation
          }
        }
        stats {
          id
          ...ecTranslatorHeader_stats
        }
      }
    }
  `,
  variables: { input: { parentId: theKey.id, attrs } },
  optimisticResponse: {
    createTranslationInKeyTranslations: {
      createdTranslationEdge: {
        node: attrs,
      },
    },
  },
  // updater: store => {
  //   const payload = store.getRootField('createTranslationInKeyTranslations');
  //   const translationEdge = payload.getLinkedRecord('createdTranslationEdge');
  //   sharedUpdater(store, theKey, translationEdge);
  // },
  configs: [
    {
      type: 'RANGE_ADD',
      parentID: theKey.id,
      connectionInfo: [
        { key: 'TranslatorRow_theKey_translations', rangeBehavior: 'append' },
        { key: 'Translator_viewer_translations', rangeBehavior: 'append' },
      ],
      edgeName: 'createdTranslationEdge',
    },
  ],
});

export default createTranslation;
