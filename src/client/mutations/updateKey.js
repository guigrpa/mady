import { graphql } from 'react-relay';

const updateKey = ({ theKey, set }) => ({
  mutation: graphql`
    mutation updateKeyMutation($input: UpdateKeyInput!) {
      updateKey(input: $input) {
        key {
          isDeleted
        }
      }
    }
  `,
  variables: { input: { id: theKey.id, set } },
});

export default updateKey;
