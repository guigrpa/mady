import { graphql } from 'react-relay';

const updateKey = ({ theKey, attrs }) => ({
  mutation: graphql`
    mutation updateKeyMutation($input: UpdateKeyInput!) {
      updateKey(input: $input) {
        key {
          isDeleted
        }
      }
    }
  `,
  variables: { input: { id: theKey.id, attrs } },
});

export default updateKey;
