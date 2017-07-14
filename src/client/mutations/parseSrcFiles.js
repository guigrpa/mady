import { graphql } from 'react-relay';

const parseSrcFiles = graphql`
  mutation parseSrcFilesMutation($input: ParseSrcFilesInput!) {
    parseSrcFiles(input: $input) {
      viewer {
        keys(first: 100000) {
          edges {
            node {
              id
              unusedSince
            }
          }
        }
      }
    }
  }
`;

export default parseSrcFiles;
