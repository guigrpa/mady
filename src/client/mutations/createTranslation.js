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
const createTranslation = ({ theKey, set, unset }) => ({
  mutation: graphql`
    mutation createTranslationMutation(
      $input: CreateTranslationInKeyTranslationsInput!
    ) {
      createTranslationInKeyTranslations(input: $input) {
        createdTranslationEdge {
          __typename
          cursor
          node {
            ...eeTranslation_translation
          }
        }
      }
    }
  `,
  variables: { input: { parentId: theKey.id, set, unset } },
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
      ],
      edgeName: 'createdTranslationEdge',
    },
  ],
});

export default createTranslation;
