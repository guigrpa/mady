import { graphql } from 'react-relay';
// import { merge } from 'timm';

const updateTranslation = ({ translation, attrs }) => ({
  mutation: graphql`
    mutation updateTranslationMutation($input: UpdateTranslationInput!) {
      updateTranslation(input: $input) {
        translation {
          isDeleted
          ...eeTranslation_translation
        }
      }
    }
  `,
  variables: { input: { id: translation.id, attrs } },
  // optimisticResponse: {
  //   updateTranslation: {
  //     translation: merge(translation, attrs),
  //   },
  // },
});

export default updateTranslation;
