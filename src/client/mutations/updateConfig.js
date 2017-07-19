import { graphql } from 'react-relay';

const updateConfig = ({ viewer, attrs }) => ({
  mutation: graphql`
    mutation updateConfigMutation($input: UpdateConfigInput!) {
      updateConfig(input: $input) {
        viewer {
          ...aeSettings_viewer
        }
      }
    }
  `,
  variables: { input: { attrs } },
  optimisticResponse: {
    updateConfig: {
      viewer: {
        id: viewer.id,
        config: { ...viewer.config, ...attrs },
      },
    },
  },
});

export default updateConfig;
