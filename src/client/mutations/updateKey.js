import { graphql } from 'react-relay';
// import { set as timmSet } from 'timm';

const updateKey = ({ theKey, attrs }) => ({
  mutation: graphql`
    mutation updateKeyMutation($input: UpdateKeyInput!) {
      updateKey(input: $input) {
        key {
          isDeleted
        }
        stats {
          id
          ...ecTranslatorHeader_stats
        }
      }
    }
  `,
  variables: { input: { id: theKey.id, attrs } },
  optimisticResponse: {
    updateKey: {
      key: { ...theKey, ...attrs },
    },
  },
});

export default updateKey;
