import Relay                from 'react-relay';
import timm                 from 'timm';

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
class ParseSrcFilesMutation extends Relay.Mutation {
  static fragments = {
    viewer: () => Relay.QL`fragment on Viewer { id }`,
  };
  getMutation() {
    return Relay.QL`mutation { parseSrcFiles }`;
  }
  getVariables() {
    return { storyId: this.props.storyId };
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

// -------------------------------------------------------
class CompileTranslationsMutation extends Relay.Mutation {
  static fragments = {};
  getMutation() {
    return Relay.QL`mutation { compileTranslations }`;
  }
  getVariables() {
    return { storyId: this.props.storyId };
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

// =======================================================
// UpdateConfigMutation
// =======================================================
class UpdateConfigMutation extends Relay.Mutation {
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
        viewer { config }
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
class DeleteKeyMutation extends Relay.Mutation {
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
    return Relay.QL`mutation {deleteKeyInViewerKeys}`;
  }
  getVariables() {
    return {
      id: this.props.id,
      parentId: this.props.viewer.id,
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteKeyInViewerKeysPayload {
        parent { keys }
        deletedKeyId
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'parent',
      parentID: this.props.viewer.id,
      connectionName: 'keys',
      deletedIDFieldName: 'deletedKeyId',
    }];
  }
  getOptimisticResponse() {
    const prevEdges = this.props.viewer.keys.edges;
    const edges = prevEdges.filter(({ node }) => node.id !== this.props.id);
    return {
      parent: { keys: { edges } },
      deletedKeyId: this.props.id,
    };
  }
  getCollisionKey() { return this.props.id; }
}


// =======================================================
// Translation mutations
// =======================================================
class UpdateTranslationMutation extends Relay.Mutation {
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
    return [{
      type: 'FIELDS_CHANGE',
      fieldIDs: {
        translation: this.props.translation.id,
      },
    }];
  }
  getOptimisticResponse() {
    const { translation, set, unset } = this.props;
    const nextTranslation = applySetUnset(translation, set, unset);
    return { translation: nextTranslation };
  }
  getCollisionKey() { return this.props.id; }
}

// -------------------------------------------------------
class CreateTranslationMutation extends Relay.Mutation {
  static fragments = {
    theKey: () => Relay.QL`
      fragment on Key { id }
    `,
  };
  getMutation() {
    return Relay.QL`mutation {createTranslationInKeyTranslations}`;
  }
  getVariables() {
    return {
      set: this.props.set,
      unset: this.props.unset,
      parentId: this.props.theKey.id,
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on CreateTranslationInKeyTranslationsPayload {
        parent { translations }
        createdTranslationEdge
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'RANGE_ADD',
      parentName: 'parent',
      parentID: this.props.theKey.id,
      connectionName: 'translations',
      edgeName: 'createdTranslationEdge',
      rangeBehaviors: {
        '': 'append',
      },
    }];
  }
  // Based on facebook/relay/examples/star-wars/js/mutation/AddShipMutation.js
  getOptimisticResponse() {
    const { set, unset, theKey } = this.props;
    const node = applySetUnset(undefined, set, unset);
    return {
      parent: { id: theKey.id },
      createdTranslationEdge: { node },
    };
  }
  getCollisionKey() {
    return `${this.props.theKey.id}_${this.props.set.lang}`;
  }
}

// -------------------------------------------------------
class DeleteTranslationMutation extends Relay.Mutation {
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
    return Relay.QL`mutation {deleteTranslationInKeyTranslations}`;
  }
  getVariables() {
    return {
      id: this.props.id,
      parentId: this.props.theKey.id,
      storyId: this.props.storyId,
    };
  }
  getFatQuery() {
    return Relay.QL`
      fragment on DeleteTranslationInKeyTranslationsPayload {
        parent { translations }
        deletedTranslationId
      }
    `;
  }
  getConfigs() {
    return [{
      type: 'NODE_DELETE',
      parentName: 'parent',
      parentID: this.props.theKey.id,
      connectionName: 'translations',
      deletedIDFieldName: 'deletedTranslationId',
    }];
  }
  // Based (indirectly) on facebook/relay/examples/star-wars/js/mutation/AddShipMutation.js
  getOptimisticResponse() {
    const { theKey, id } = this.props;
    // const nextEdges = theKey.translations.edges.filter(({ node }) => node.id !== id);
    // const nextKey = timm.setIn(theKey, ['translations', 'edges'], nextEdges);
    return {
      parent: { id: theKey.id },
      // parent: nextKey,
      deletedTranslationId: id,
    };
  }
  getCollisionKey() { return this.props.id; }
}

// ==============================================
// Public API
// ==============================================
export {
  ParseSrcFilesMutation,
  CompileTranslationsMutation,

  UpdateConfigMutation,

  DeleteKeyMutation,

  UpdateTranslationMutation,
  CreateTranslationMutation,
  DeleteTranslationMutation,
};