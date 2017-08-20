import { graphql } from 'react-relay';

const parsedSrcFiles = () => ({
  subscription: graphql`
    subscription parsedSrcFilesSubscription {
      parsedSrcFiles {
        viewer {
          ...adTranslator_viewer
        }
      }
    }
  `,
});

export default parsedSrcFiles;
