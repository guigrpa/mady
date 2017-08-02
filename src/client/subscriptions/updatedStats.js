import { graphql } from 'react-relay';

const updatedStats = () => ({
  subscription: graphql`
    subscription updatedStatsSubscription {
      updatedStats {
        stats {
          ...ecTranslatorHeader_stats
        }
      }
    }
  `,
});

export default updatedStats;
