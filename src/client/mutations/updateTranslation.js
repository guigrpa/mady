import { graphql } from 'react-relay';
// import { merge } from 'timm';

const updateTranslation = ({ translation, set }) => ({
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
  variables: { input: { id: translation.id, set } },
  // optimisticResponse: {
  //   updateTranslation: {
  //     translation: merge(translation, set),
  //   },
  // },
});

export default updateTranslation;
