import { graphql } from 'react-relay';

const updatedKey = () => ({
  subscription: graphql`
    subscription updatedKeySubscription {
      updatedKey {
        key {
          text
          isDeleted
        }
      }
    }
  `,
});

export default updatedKey;
