import Relay                from 'react-relay';
import {
  pick,
}                           from 'lodash';

export class ParseSrcFilesMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer {id}`,
  };
  getMutation() {
    return Relay.QL`mutation {parseSrcFiles}`;
  }
  getVariables() { return {}; }
  getFatQuery() {
    return Relay.QL`
      fragment on ParseSrcFilesPayload {
        viewer {
          keys
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }
}

export class UpdateConfigMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer {id}`,
  };
  getMutation() {
    return Relay.QL`mutation {updateConfig}`;
  }
  getVariables() {
    return pick(this.props, ['set', 'unset']);
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateConfigPayload {
        viewer {
          config
        }
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        viewer: this.props.viewer.id,
      },
    }];
  }
}
