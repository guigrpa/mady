import { graphql } from 'react-relay';

const createdTranslation = () => ({
  subscription: graphql`
    subscription createdTranslationSubscription {
      createdTranslationInKeyTranslations {
        viewer {
          ...adTranslator_viewer
        }
      }
    }
  `,
});

export default createdTranslation;
