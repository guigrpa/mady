import { mainStory }        from 'storyboard';
import timm                 from 'timm';
import Promise              from 'bluebird';
import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  // GraphQLInt,
  // GraphQLFloat,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  graphql,
}                           from 'graphql';
import {
  introspectionQuery,
  printSchema,
}                           from 'graphql/utilities';
import {
  nodeDefinitions,
  globalIdField,
  toGlobalId,
  fromGlobalId,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  // cursorForObjectInConnection,
  mutationWithClientMutationId,
}                           from 'graphql-relay';
import {
  capitalize,
  lowerFirst,
  omitBy,
  isUndefined,
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
let viewerRootField   = null;

// ==============================================
// Public API
// ==============================================
export function getSchema() { return gqlSchema; }
export function getSchemaShorthand() { return printSchema(gqlSchema); }
export function runQuery(query, operation, rootValue, variables) {
  return graphql(gqlSchema, query, rootValue, null, variables, operation);
}
export function runIntrospect() {
  return Promise.resolve()
  .then(() => graphql(gqlSchema, introspectionQuery))
  .then((result) => {
    if (result.errors) {
      for (const error of result.errors) {
        mainStory.error('gql', 'Error introspecting schema:', { attach: error });
      }
    }
    return result;
  });
}

export function init() {
  // ==============================================
  // Interfaces
  // ==============================================
  mainStory.debug('gql', 'Creating interfaces...');
  const {
    nodeInterface,
    nodeField,
  } = nodeDefinitions(getNodeFromGlobalId, getNodeType);
  gqlInterfaces.Node = nodeInterface;
  const nodeRootField = nodeField;

  // ==============================================
  // Types
  // ==============================================
  mainStory.debug('gql', 'Creating types...');

  let configBaseField       = null;
  let keysBaseField         = null;
  let translationsBaseField = null;

  // ----------------------------------------------
  // Viewer
  // ----------------------------------------------
  gqlTypes.Viewer = new GraphQLObjectType({
    name: 'Viewer',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: node => node._type === 'Viewer',
    fields: () => ({
      id: globalIdField('Viewer'),
      config: configBaseField,
      keys: keysBaseField,
      translations: translationsBaseField,
      anyNode: {
        type: gqlInterfaces.Node,
        args: { id: { type: GraphQLID } },
        resolve: (base, args) => getNodeFromGlobalId(args.id),
      },
    }),
  });

  viewerRootField = {
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
    fMinify:        { type: GraphQLBoolean },
  });

  gqlTypes.Config = new GraphQLObjectType({
    name: 'Config',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => timm.merge(configFields(), {
      id: globalIdField('Config'),
    }),
  });

  gqlTypes.ConfigUpdate = new GraphQLInputObjectType({
    name: 'ConfigUpdate',
    fields: () => configFields(),
  });

  configBaseField = {
    type: gqlTypes.Config,
    resolve: () => db.getConfig(),
  };

  addMutation('Config', 'UPDATE', { fSingleton: true });

  // ----------------------------------------------
  // Keys
  // ----------------------------------------------
  gqlTypes.Key = new GraphQLObjectType({
    name: 'Key',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id:             globalIdField('Key'),
      context:        { type: GraphQLString },
      text:           { type: GraphQLString },
      firstUsed:      { type: GraphQLString },
      unusedSince:    { type: GraphQLString },
      sources:        { type: new GraphQLList(GraphQLString) },
      translations: {
        type: gqlTypes.TranslationConnection,
        args: connectionArgs,
        resolve: (base, args) => connectionFromArray(db.getKeyTranslations(base.id), args),
      },
    }),
  });

  gqlTypes.KeyCreate = new GraphQLInputObjectType({
    name: 'KeyCreate',
    fields: () => ({
      context:        { type: GraphQLString },
      text:           { type: GraphQLString },
      firstUsed:      { type: GraphQLString },
      unusedSince:    { type: GraphQLString },
    }),
  });

  gqlTypes.KeyUpdate = new GraphQLInputObjectType({
    name: 'KeyUpdate',
    fields: () => ({
      context:        { type: GraphQLString },
      text:           { type: GraphQLString },
      firstUsed:      { type: GraphQLString },
      unusedSince:    { type: GraphQLString },
    }),
  });

  addConnectionType('Key');

  keysBaseField = {
    type: gqlTypes.KeyConnection,
    args: connectionArgs,
    resolve: (base, args) => connectionFromArray(db.getKeys(), args),
  };

  addMutation('Key', 'CREATE');
  addMutation('Key', 'UPDATE');
  addMutation('Key', 'DELETE');
  gqlMutations.parseSrcFiles = mutationWithClientMutationId({
    name: 'ParseSrcFiles',
    inputFields: {
      storyId:        { type: GraphQLString },
    },
    mutateAndGetPayload: ({ storyId }) => {
      const story = mainStory.child({
        src: 'gql',
        title: 'Mutation: parse source files',
        extraParents: storyId,
      });
      try {
        db.parseSrcFiles({ story });
      } catch (err) {
        throw err;
      } finally {
        story.close();
      }
      return {};
    },
    outputFields: {
      keys: keysBaseField,
      viewer: viewerRootField,
    },
  });

  // ----------------------------------------------
  // Translations
  // ----------------------------------------------
  gqlTypes.Translation = new GraphQLObjectType({
    name: 'Translation',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id:             globalIdField('Translation'),
      lang:           { type: GraphQLString },
      translation:    { type: GraphQLString },
      keyId:          { type: GraphQLID, resolve: (o) => toGlobalId('Key', o.keyId) },
    }),
  });

  gqlTypes.TranslationCreate = new GraphQLInputObjectType({
    name: 'TranslationCreate',
    fields: () => ({
      lang:           { type: GraphQLString },
      translation:    { type: GraphQLString },
      keyId:          { type: GraphQLID },
    }),
  });

  gqlTypes.TranslationUpdate = new GraphQLInputObjectType({
    name: 'TranslationUpdate',
    fields: () => ({
      translation:    { type: GraphQLString },
    }),
  });

  addConnectionType('Translation');

  translationsBaseField = {
    type: gqlTypes.TranslationConnection,
    args: connectionArgs,
    resolve: (base, args) => connectionFromArray(db.getTranslations(), args),
  };

  const globalIds = ['keyId'];
  const relations = [
    {
      name: 'key',
      type: 'Key',
      resolve: translation => db.getKey(translation.keyId),
    },
  ];
  addMutation('Translation', 'CREATE', { globalIds, relations });
  addMutation('Translation', 'UPDATE', { globalIds });
  addMutation('Translation', 'DELETE', { globalIds, relations });
  gqlMutations.compileTranslations = mutationWithClientMutationId({
    name: 'CompileTranslations',
    inputFields: {
      storyId:        { type: GraphQLString },
    },
    mutateAndGetPayload: ({ storyId }) => {
      const story = mainStory.child({
        src: 'gql',
        title: 'Mutation: compile translations',
        extraParents: storyId,
      });
      try {
        db.compileTranslations({ story });
      } catch (err) {
        throw err;
      } finally {
        story.close();
      }
      return {};
    },
    outputFields: {},
  });

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
        'updateConfig',
        'createKey',
        'updateKey',
        'deleteKey',
        'parseSrcFiles',
        'createTranslation',
        'updateTranslation',
        'deleteTranslation',
        'compileTranslations',
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

function getNodeFromGlobalId(globalId) {
  if (globalId == null) return null;
  const { type, id } = fromGlobalId(globalId);
  return getNodeFromTypeAndLocalId(type, id);
}

function getNodeFromTypeAndLocalId(type, localId) {
  let out;
  switch (type) {
    case 'Viewer':
      out = viewer;
      break;
    case 'Config':
      out = db.getConfig();
      break;
    case 'Key':
      out = db.getKey(localId);
      break;
    case 'Translation':
      out = db.getTranslation(localId);
      break;
    default:
      out = null;
      break;
  }
  return addTypeAttr(out, type);
}

function addTypeAttr(obj, type) {
  return obj
    ? timm.set(obj, '_type', type)
    : obj;
}

function addConnectionType(name) {
  const { connectionType, edgeType } = connectionDefinitions({
    name,
    nodeType: gqlTypes[name],
  });
  gqlTypes[`${name}Connection`] = connectionType;
  gqlTypes[`${name}Edge`] = edgeType;
}

function addMutation(type, op, options = {}) {
  const name = `${capitalize(op)}${type}`;

  // Input fields
  const inputFields = {
    storyId: { type: GraphQLString },
  };
  if (op !== 'CREATE' && !options.fSingleton) {
    inputFields.id = { type: new GraphQLNonNull(GraphQLID) };
  }
  if (op !== 'DELETE') {
    inputFields.set = { type: gqlTypes[`${type}${capitalize(op)}`] };
    inputFields.unset = { type: new GraphQLList(GraphQLString) };
  }

  // The operation
  const mutateAndGetPayload = ({ id: globalId, set, unset, storyId }) => {
    const story = mainStory.child({
      src: 'gql',
      title: `Mutation: ${op} on ${type} ${globalId || ''}`,
      extraParents: storyId,
    });
    let out;
    try {
      out = mutate(type, op, globalId, set, unset, options, story);
    } catch (err) {
      throw err;
    } finally {
      story.close();
    }
    return Promise.resolve(out).delay(1500);
  };

  // Output fields
  const outputFields = { viewer: viewerRootField };
  if (op !== 'DELETE') {
    outputFields[lowerFirst(type)] = {
      type: gqlTypes[type],
      resolve: ({ node }) => node,
    };
  }
  const relations = options.relations != null ? options.relations : [];
  for (const relation of relations) {
    outputFields[relation.name] = {
      type: gqlTypes[relation.type],
      resolve: ({ node }) => relation.resolve(node),
    };
  }

  // Save mutation
  gqlMutations[`${op.toLowerCase()}${type}`] = mutationWithClientMutationId({
    name,
    inputFields,
    mutateAndGetPayload,
    outputFields,
  });
}

function mutate(type, op, globalId, set = {}, unset = [], options = {}, story) {
  const localId = (op !== 'CREATE' && !options.fSingleton)
    ? fromGlobalId(globalId).id
    : null;
  const out = { globalId, localId };
  if (op === 'DELETE') {
    out.node = db[`delete${type}`](localId, { story });
  } else {
    let newAttrs = mergeSetUnset(set, unset);
    newAttrs = resolveGlobalIds(newAttrs, options.globalIds);
    if (op === 'CREATE') {
      out.node = db[`create${type}`](newAttrs, { story });
      out.localId = out.node.id;
    } else {
      if (options.fSingleton) {
        out.node = db[`update${type}`](newAttrs, { story });
      } else {
        out.node = db[`update${type}`](localId, newAttrs, { story });
      }
    }
  }
  out.node = addTypeAttr(out.node, type);
  return out;
}

function mergeSetUnset(set, unset) {
  const attrs = omitBy(set, isUndefined);
  for (const attr of unset) {
    attrs[attr] = null;
  }
  return attrs;
}

function resolveGlobalIds(prevAttrs, globalIds = []) {
  let attrs = prevAttrs;
  if (attrs == null || !globalIds.length) return attrs;
  for (const locatorPath of globalIds) {
    const tokens = locatorPath.split('.');
    const curToken = tokens[0];
    if (tokens.length === 1) {
      const globalId = attrs[curToken];
      if (globalId == null) continue;
      attrs = timm.set(attrs, curToken, fromGlobalId(globalId).id);
    } else {
      const subLocatorPath = tokens.slice(1).join('.');
      if (curToken === '*') {
        for (let idx = 0; idx < attrs.length; idx++) {
          attrs = timm.set(attrs, idx, resolveGlobalIds(attrs[idx], [subLocatorPath]));
        }
      } else {
        attrs = timm.set(attrs, curToken, resolveGlobalIds(attrs[curToken], [subLocatorPath]));
      }
    }
  }
  return attrs;
}

// function getTypePlural(type) { return `${type}s`; } // obviously, a stub
