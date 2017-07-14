import { graphql } from 'react-relay';

const updateTranslation = graphql`
  mutation updateTranslationMutation($input: UpdateTranslationInput!) {
    updateTranslation(input: $input) {
      translation {
        translation
        fuzzy
      }
    }
  }
`;

export default updateTranslation;
