import { graphql } from 'react-relay';

const parseSrcFiles = () => ({
  mutation: graphql`
    mutation parseSrcFilesMutation($input: ParseSrcFilesInput!) {
      parseSrcFiles(input: $input) {
        viewer {
          ...adTranslator_viewer
        }
      }
    }
  `,
});

export default parseSrcFiles;
