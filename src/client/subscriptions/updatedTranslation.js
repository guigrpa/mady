import { graphql } from 'react-relay';

const updatedTranslation = () => ({
  subscription: graphql`
    subscription updatedTranslationSubscription {
      updatedTranslation {
        translation {
          isDeleted
          ...eeTranslation_translation
        }
      }
    }
  `,
});

export default updatedTranslation;
