import { mainStory }        from 'storyboard';
import timm                 from 'timm';
import {
  GraphQLID,
  GraphQLString,
  // GraphQLBoolean,
  // GraphQLInt,
  // GraphQLFloat,
  GraphQLObjectType,
  // GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
}                           from 'graphql';
import * as gqlRelay        from 'graphql-relay';
import {
  pick,
}                           from 'lodash';
import * as db              from './db';

// ==============================================
// Private state
// ==============================================
const gqlInterfaces   = {};
const gqlTypes        = {};
const gqlMutations    = {};
let gqlSchema         = null;
const viewer          = { _type: 'Viewer', id: 'me' };

// ==============================================
// Public API
// ==============================================
export function getSchema() { return gqlSchema; }

export function init() {
  // ==============================================
  // Interfaces
  // ==============================================
  mainStory.debug('gql', 'Creating interfaces...');
  const {
    nodeInterface,
    nodeField,
  } = gqlRelay.nodeDefinitions(getNode, getNodeType);
  gqlInterfaces.Node = nodeInterface;
  const nodeRootField = nodeField;

  // ==============================================
  // Types
  // ==============================================
  mainStory.debug('gql', 'Creating types...');

  let configBaseField            = null;
  let keysBaseConnection         = null;
  let translationsBaseConnection = null;

  // ----------------------------------------------
  // Viewer
  // ----------------------------------------------
  gqlTypes.Viewer = new GraphQLObjectType({
    name: 'Viewer',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: node => node._type === 'Viewer',
    fields: () => ({
      id: gqlRelay.globalIdField('Viewer'),
      config: configBaseField,
      keys: keysBaseConnection,
      translations: translationsBaseConnection,
    }),
  });

  const viewerRootField = {
    type: gqlTypes.Viewer,
    resolve: () => viewer,
  };

  // ----------------------------------------------
  // Config
  // ----------------------------------------------
  const configFields = () => ({
    srcPaths:       { type: new GraphQLList(GraphQLString) },
    srcExtensions:  { type: new GraphQLList(GraphQLString) },
    langs:          { type: new GraphQLList(GraphQLString) },
  });

  gqlTypes.Config = new GraphQLObjectType({
    name: 'Config',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => timm.merge(configFields(), {
      id: gqlRelay.globalIdField('Config'),
    }),
  });

  configBaseField = {
    type: gqlTypes.Config,
    resolve: () => db.getConfig(),
  };

  addUpdateMutation('Config');

  // ----------------------------------------------
  // Keys
  // ----------------------------------------------
  const keyFields = () => ({
    context:        { type: GraphQLString },
    text:           { type: GraphQLString },
    firstUsed:      { type: GraphQLString },
    unusedSince:    { type: GraphQLString },
    sources:        { type: new GraphQLList(GraphQLString) },
  });

  gqlTypes.Key = new GraphQLObjectType({
    name: 'Key',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => timm.merge(keyFields(), {
      id: gqlRelay.globalIdField('Key'),
    }),
  });

  addConnectionType('Key');

  keysBaseConnection = {
    type: gqlTypes.KeyConnection,
    args: gqlRelay.connectionArgs,
    resolve: (base, args) => gqlRelay.connectionFromArray(db.getKeys(), args),
  };

  addCreateMutation('Key');
  addUpdateMutation('Key');
  addDeleteMutation('Key');
  gqlMutations.updateKeys = gqlRelay.mutationWithClientMutationId({
    name: 'updateKeys',
    inputFields: {},
    mutateAndGetPayload: () => {
      db.updateKeys();
      return {};
    },
    outputFields: {
      keys: keysBaseConnection,
      viewer: viewerRootField,
    },
  });

  // ----------------------------------------------
  // Translations
  // ----------------------------------------------
  const translationFields = () => ({
    lang:           { type: GraphQLString },
    translation:    { type: GraphQLString },
    keyId: {
      type: GraphQLID,
      resolve: (o) => gqlRelay.toGlobalId('Key', o.keyId),
    },
  });

  gqlTypes.Translation = new GraphQLObjectType({
    name: 'Translation',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => timm.merge(translationFields(), {
      id: gqlRelay.globalIdField('Translation'),
    }),
  });

  addConnectionType('Translation');

  translationsBaseConnection = {
    type: gqlTypes.TranslationConnection,
    args: timm.merge(gqlRelay.connectionArgs, {
      lang: { type: new GraphQLNonNull(GraphQLString) },
    }),
    resolve: (base, args) => gqlRelay.connectionFromArray(db.getTranslations(args.lang), args),
  };

  addCreateMutation('Translation', { globalIds: ['keyId'] });
  addUpdateMutation('Translation', { globalIds: ['keyId'] });
  addDeleteMutation('Translation');

  // ==============================================
  // Schema
  // ==============================================
  mainStory.debug('gql', 'Creating schema...');
  gqlSchema = new GraphQLSchema({
    query: new GraphQLObjectType({
      name: 'Query',
      fields: () => ({
        node: nodeRootField,
        viewer: viewerRootField,
      }),
    }),

    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => pick(gqlMutations, [
        // 'updateConfig',
        // 'createKey',
        // 'updateKey',
        // 'deleteKey',
        'updateKeys',
        // 'createTranslation',
        // 'updateTranslation',
        // 'deleteTranslation',
      ]),
    }),
  });
}

// ==============================================
// Relay-related helpers
// ==============================================
function getNodeType(node) {
  if (!node) return null;
  return gqlTypes[node._type];
}

function getNode(globalId) {
  const { type, id } = gqlRelay.fromGlobalId(globalId);
  mainStory.debug('gql', `Resolving node: type=${type}, id=${id}...`);
  let out;
  switch (type) {
    case 'Viewer':
      out = viewer;
      break;
    case 'Config':
      out = db.getConfig();
      if (out) {
        out = timm.set(out, '_type', 'Config');
      }
      break;
    case 'Key':
      out = db.getKey(id);
      if (out) {
        out = timm.set(out, '_type', 'Key');
      }
      break;
    case 'Translation':
      out = db.getTranslation(id);
      if (out) {
        out = timm.set(out, '_type', 'Translation');
      }
      break;
    default:
      out = null;
      break;
  }
  return out;
}

function addConnectionType(name) {
  const { connectionType, edgeType } = gqlRelay.connectionDefinitions({
    name,
    nodeType: gqlTypes[name],
  });
  gqlTypes[`${name}Connection`] = connectionType;
  gqlTypes[`${name}Edge`] = edgeType;
}

function addCreateMutation() {}
function addUpdateMutation() {}
function addDeleteMutation() {}
