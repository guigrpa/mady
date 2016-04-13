import Relay                from 'react-relay';
import {
  pick,
}                           from 'lodash';

// =======================================================
// ParseSrcFilesMutation
// =======================================================
export class ParseSrcFilesMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  };
  getMutation() {
    return Relay.QL`mutation { parseSrcFiles }`;
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

// =======================================================
// UpdateConfigMutation
// =======================================================
export class UpdateConfigMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  };
  getMutation() {
    return Relay.QL`mutation { updateConfig }`;
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

// =======================================================
// Translation mutations
// =======================================================
export class CreateTranslationMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation {createTranslation}`;
  }
  getVariables() {
    return {
      set: this.props.set,
      unset: this.props.unset,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateTranslationPayload {
        key
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          key: this.props.set.keyId,
        },
      },
    ];
  }
  getCollisionKey() {
    return `${this.props.set.keyId}_${this.props.set.lang}`;
  }
}

// -------------------------------------------------------
export class UpdateTranslationMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation {updateTranslation}`;
  }
  getVariables() {
    return {
      id: this.props.id,
      set: this.props.set,
      unset: this.props.unset,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on UpdateTranslationPayload {
        translation
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          translation: this.props.id,
        },
      },
    ];
  }
  getCollisionKey() {
    return this.props.id;
  }
}

// -------------------------------------------------------
export class DeleteTranslationMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation {deleteTranslation}`;
  }
  getVariables() {
    return { id: this.props.id };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTranslationPayload {
        key
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          key: this.props.keyId,
        },
      },
    ];
  }
  getCollisionKey() {
    return this.props.id;
  }
}
