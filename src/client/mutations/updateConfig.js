import { graphql } from 'react-relay';

const updateConfig = ({ attrs }) => ({
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
});

export default updateConfig;
