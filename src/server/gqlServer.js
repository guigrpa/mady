import { mainStory }        from 'storyboard';
import timm                 from 'timm';
import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLInt,
  GraphQLFloat,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
}                           from 'graphql';
import * as gqlRelay        from 'graphql-relay';
import Promise              from 'bluebird';
import * as db              from './db';

// ==============================================
// Private state
// ==============================================
const gqlInterfaces   = {};
const gqlTypes        = {};
const gqlMutations    = {};
let gqlSchema        = null;
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

  const configBaseField = {
    type: gqlTypes.Config,
    resolve: () => db.getConfig(),
  };

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

  const keysBaseConnection = {
    type: gqlTypes.KeyConnection,
    args: gqlRelay.connectionArgs,
    resolve: (base, args) => gqlRelay.connectionFromArray(db.getKeys(), args),
  };

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

  const translationsBaseConnection = {
    type: gqlTypes.TranslationConnection,
    args: timm.merge(gqlRelay.connectionArgs, {
      lang: { type: GraphQLString },
    }),
    resolve: (base, args) => gqlRelay.connectionFromArray(db.getTranslations(args), args),
  };


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

    /*
    mutation: new GraphQLObjectType({
      name: 'Mutation',
      fields: () => {},
    }),
    */
  });
}

// ==============================================
// Relay-related helpers
// ==============================================
function getNodeType(node) { return gqlTypes[node._type]; }

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
      break;
    case 'Key':
      out = db.getKey(id);
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
