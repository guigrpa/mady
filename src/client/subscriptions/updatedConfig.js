import { graphql } from 'react-relay';

const updatedConfig = () => ({
  subscription: graphql`
    subscription updatedConfigSubscription {
      updatedConfig {
        config {
          ...aeSettings_config
        }
      }
    }
  `,
});

export default updatedConfig;
