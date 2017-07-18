import { graphql } from 'react-relay';

const updateConfig = ({ set }) => ({
  mutation: graphql`
    mutation updateConfigMutation($input: UpdateConfigInput!) {
      updateConfig(input: $input) {
        viewer {
          ...aeSettings_viewer
        }
      }
    }
  `,
  variables: { input: { set } },
});

export default updateConfig;
