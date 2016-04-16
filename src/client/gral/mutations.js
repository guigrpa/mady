import Relay                from 'react-relay';
import timm                 from 'timm';
import { filter }           from 'lodash';

function applySetUnset(item, set, unset = []) {
  let out;
  out = timm.merge({}, item, set);
  // delete out.__dataID__;
  for (const unsetAttr of unset) {
    out = timm.set(out, unsetAttr, null);
  }
  return out;
}

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
  getVariables() {
    return {
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on ParseSrcFilesPayload {
        viewer {
          keys
          anyNode
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
    return {
      set: this.props.set,
      unset: this.props.unset,
      storyId: this.props.storyId,
    };
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
  getCollisionKey() { return 'updateConfig'; }
}


// =======================================================
// Key mutations
// =======================================================
export class DeleteKeyMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`
      fragment on Viewer {
        id
        keys(first: 100000) { edges { node {
          id
        }}}
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation {deleteKey}`;
  }
  getVariables() {
    return {
      id: this.props.id,
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteKeyPayload {
        viewer {
          id
          keys
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          viewer: this.props.viewer.id,
        },
      },
    ];
  }
  getOptimisticResponse() {
    const prevEdges = this.props.viewer.keys.edges;
    const edges = filter(prevEdges, ({ node }) => node.id !== this.props.id);
    // console.log(`${prevEdges.length} -> ${edges.length}`)
    return {
      viewer: {
        id: this.props.viewer.id,
        keys: {
          edges,
        },
      },
    };
  }
  getCollisionKey() { return this.props.id; }
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
      storyId: this.props.storyId,
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
  static fragments = {
    translation: () => Relay.QL`
      fragment on Translation { id translation }
    `,
  };
  getMutation() {
    return Relay.QL`mutation {updateTranslation}`;
  }
  getVariables() {
    return {
      id: this.props.translation.id,
      set: this.props.set,
      unset: this.props.unset,
      storyId: this.props.storyId,
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
          translation: this.props.translation.id,
        },
      },
    ];
  }
  getOptimisticResponse() {
    const { translation, set, unset } = this.props;
    const nextTranslation = applySetUnset(translation, set, unset);
    return { translation: nextTranslation };
  }
  getCollisionKey() { return this.props.id; }
}

// -------------------------------------------------------
export class DeleteTranslationMutation extends Relay.Mutation {
  static fragments = {
    theKey: () => Relay.QL`
      fragment on Key {
        id
        translations(first: 100000) { edges { node {
          id
        }}}
      }
    `,
  };
  getMutation() {
    return Relay.QL`mutation {deleteTranslation}`;
  }
  getVariables() {
    return {
      id: this.props.id,
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTranslationPayload {
        key {
          translations
        }
      }
    `;
  }
  getConfigs() {
    return [
      {
        type: 'FIELDS_CHANGE',
        fieldIDs: {
          key: this.props.theKey.id,
        },
      },
    ];
  }
  /*
  getOptimisticResponse() {
    const { theKey, id } = this.props;
    console.log(theKey.translations.edges);
    const nextEdges = filter(theKey.translations.edges, o => o.node.id !== id);
    const nextKey = timm.setIn(theKey, ['translations', 'edges'], nextEdges);
    console.log(nextKey.translations.edges);
    return { key: nextKey };
  }
  */
  getCollisionKey() { return this.props.id; }
}

// -------------------------------------------------------
export class CompileTranslationsMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation { compileTranslations }`;
  }
  getVariables() {
    return {
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CompileTranslationsPayload {
        clientMutationId
      }
    `;
  }
  getConfigs() { return []; }
  getCollisionKey() { return 'compileTranslations'; }
}
