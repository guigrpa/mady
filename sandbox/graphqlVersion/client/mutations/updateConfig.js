import { graphql } from 'react-relay';

const updateConfig = ({ config, attrs }) => ({
  mutation: graphql`
    mutation updateConfigMutation($input: UpdateConfigInput!) {
      updateConfig(input: $input) {
        config {
          ...aeSettings_config
        }
        stats {
          id
          ...ecTranslatorHeader_stats
        }
      }
    }
  `,
  variables: { input: { attrs } },
  optimisticResponse: {
    updateConfig: {
      config: { ...config, ...attrs },
    },
  },
});

export default updateConfig;
