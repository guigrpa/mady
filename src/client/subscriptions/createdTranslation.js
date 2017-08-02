import { graphql } from 'react-relay';
import { ConnectionHandler } from 'relay-runtime';

const createdTranslation = () => ({
  subscription: graphql`
    subscription createdTranslationSubscription {
      createdTranslationInKeyTranslations {
        createdTranslationEdge {
          node {
            keyId
            ...eeTranslation_translation
          }
        }
      }
    }
  `,
  updater: store => {
    const payload = store.getRootField('createdTranslationInKeyTranslations');
    const translationEdge = payload.getLinkedRecord('createdTranslationEdge');
    if (!translationEdge) return;
    const translation = translationEdge.getLinkedRecord('node');
    if (!translation) return;
    const keyId = translation.getValue('keyId');
    const keyProxy = store.get(keyId);
    ConnectionHandler.insertEdgeAfter(
      ConnectionHandler.getConnection(
        keyProxy,
        'TranslatorRow_theKey_translations'
      ),
      translationEdge
    );
    // ConnectionHandler.insertEdgeAfter(
    //   ConnectionHandler.getConnection(
    //     keyProxy,
    //     'Translator_viewer_translations'
    //   ),
    //   translationEdge
    // );
  },
});

export default createdTranslation;
