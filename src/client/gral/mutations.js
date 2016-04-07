import React                from 'react';
import Relay                from 'react-relay';

export class ParseSrcFilesMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer {id}`,
  };
  getMutation() {
    return Relay.QL`mutation {parseSrcFiles}`;
  }
  getVariables() { return {}; }

  // REVIEW!!
  getFatQuery() {
    return Relay.QL`
      fragment on ParseSrcFilesPayload {
        viewer {
          keys
        }
      }
    `;
  }
  
  // REVIEW!!
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIds: {
        viewer: this.props.viewer.id,
      },
    }]
  }
}
