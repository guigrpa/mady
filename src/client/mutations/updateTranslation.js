import { graphql } from 'react-relay';

const updateTranslation = ({ translation, attrs }) => ({
  mutation: graphql`
    mutation updateTranslationMutation($input: UpdateTranslationInput!) {
      updateTranslation(input: $input) {
        translation {
          isDeleted
          ...eeTranslation_translation
        }
        stats {
          id
          ...ecTranslatorHeader_stats
        }
      }
    }
  `,
  variables: { input: { id: translation.id, attrs } },
  optimisticResponse: {
    updateTranslation: {
      translation: { ...translation, ...attrs },
    },
  },
});

export default updateTranslation;
