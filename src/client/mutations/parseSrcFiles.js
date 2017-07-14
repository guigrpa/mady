import { graphql } from 'react-relay';

/* FIXME: CHECK THAT THIS WORKS CORRECTLY */

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
