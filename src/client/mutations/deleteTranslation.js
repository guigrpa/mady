import { graphql } from 'react-relay';

const deleteTranslation = graphql`
  mutation deleteTranslationMutation($input: DeleteTranslationInput!) {
    deleteTranslation(input: $input) {
      deletedTranslationId
    }
  }
`;

export default deleteTranslation;
