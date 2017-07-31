// @flow

/* eslint-disable no-param-reassign */

import { mainStory } from 'storyboard';
import { set as timmSet } from 'timm';
import {
  GraphQLID,
  GraphQLString,
  GraphQLBoolean,
  GraphQLObjectType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLSchema,
  graphql,
} from 'graphql';
import { introspectionQuery, printSchema } from 'graphql/utilities';
import {
  nodeDefinitions,
  globalIdField,
  toGlobalId,
  fromGlobalId,
  connectionArgs,
  connectionDefinitions,
  connectionFromArray,
  offsetToCursor,
  mutationWithClientMutationId,
} from 'graphql-relay';
import { capitalize, lowerFirst, upperFirst, pick } from 'lodash';
import type { StoryT } from '../common/types';
import { subscribe } from './subscriptions';
import * as db from './db';

const NonNullString = new GraphQLNonNull(GraphQLString);
const ArrayOfNonNullString = new GraphQLList(NonNullString);

// ==============================================
// Private state
// ==============================================
const gqlInterfaces = {};
const gqlTypes = {};
const gqlMutations = {};
const gqlSubscriptions = {};
let gqlSchema;
const viewer = { _type: 'Viewer', id: 'me' };
let viewerRootField;

// ==============================================
// Public API
// ==============================================
const getSchema = () => gqlSchema;
const getSchemaShorthand = () => printSchema(gqlSchema);

const runQuery = (query: any, operation: any, rootValue: any, variables: any) =>
  graphql(gqlSchema, query, rootValue, null, variables, operation);

const runIntrospect = async (): Promise<Object> => {
  const result = await graphql(gqlSchema, introspectionQuery);
  if (result.errors) {
    result.errors.forEach(error => {
      mainStory.error('gql', 'Error introspecting schema:', {
        attach: error,
      });
    });
  }
  return result;
};

const init = () => {
  // ==============================================
  // Node interface
  // ==============================================
  mainStory.debug('gql', 'Creating interfaces...');
  const { nodeInterface, nodeField } = nodeDefinitions(
    getNodeFromGlobalId,
    getNodeType
  );
  gqlInterfaces.Node = nodeInterface;
  const nodeRootField = nodeField;

  mainStory.debug('gql', 'Creating types...');
  let configBaseField;
  let keysBaseField;

  // ==============================================
  // Viewer
  // ==============================================
  gqlTypes.Viewer = new GraphQLObjectType({
    name: 'Viewer',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: node => node._type === 'Viewer',
    fields: () => ({
      id: globalIdField('Viewer'),
      config: configBaseField,
      keys: keysBaseField,
    }),
  });

  viewerRootField = {
    type: gqlTypes.Viewer,
    resolve: () => viewer,
  };

  // ==============================================
  // Config
  // ==============================================
  gqlTypes.Config = new GraphQLObjectType({
    name: 'Config',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id: globalIdField('Config'),
      srcPaths: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      srcExtensions: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      langs: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      msgFunctionNames: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      msgRegexps: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      fMinify: { type: new GraphQLNonNull(GraphQLBoolean) },
      fJsOutput: { type: new GraphQLNonNull(GraphQLBoolean) },
      fJsonOutput: { type: new GraphQLNonNull(GraphQLBoolean) },
      fReactIntlOutput: { type: new GraphQLNonNull(GraphQLBoolean) },
    }),
  });

  gqlTypes.ConfigUpdate = new GraphQLInputObjectType({
    name: 'ConfigUpdate',
    fields: () => ({
      srcPaths: { type: ArrayOfNonNullString },
      srcExtensions: { type: ArrayOfNonNullString },
      langs: { type: ArrayOfNonNullString },
      msgFunctionNames: { type: ArrayOfNonNullString },
      msgRegexps: { type: ArrayOfNonNullString },
      fMinify: { type: GraphQLBoolean },
      fJsOutput: { type: GraphQLBoolean },
      fJsonOutput: { type: GraphQLBoolean },
      fReactIntlOutput: { type: GraphQLBoolean },
    }),
  });

  configBaseField = {
    type: new GraphQLNonNull(gqlTypes.Config),
    resolve: () => db.getConfig(),
  };

  // ------------------------
  // Mutations
  // ------------------------
  addMutation('Config', 'UPDATE', { fSingleton: true });

  // ------------------------
  // Subscriptions
  // ------------------------
  addSubscription('Config', 'UPDATED', gqlTypes, gqlSubscriptions);

  // ==============================================
  // Keys
  // ==============================================
  gqlTypes.Key = new GraphQLObjectType({
    name: 'Key',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id: globalIdField('Key'),
      isDeleted: { type: GraphQLBoolean },
      context: { type: GraphQLString },
      text: { type: new GraphQLNonNull(GraphQLString) },
      description: { type: GraphQLString },
      firstUsed: { type: new GraphQLNonNull(GraphQLString) },
      unusedSince: { type: GraphQLString },
      sources: { type: new GraphQLNonNull(ArrayOfNonNullString) },
      translations: {
        type: gqlTypes.TranslationConnection,
        args: connectionArgs,
        resolve: (base, args) =>
          connectionFromArray(db.getKeyTranslations(base.id), args),
      },
    }),
  });

  gqlTypes.KeyUpdate = new GraphQLInputObjectType({
    name: 'KeyUpdate',
    fields: () => ({
      isDeleted: { type: GraphQLBoolean },
      context: { type: GraphQLString },
      text: { type: GraphQLString },
      firstUsed: { type: GraphQLString },
      unusedSince: { type: GraphQLString },
    }),
  });

  addConnectionType('Key');

  keysBaseField = {
    type: gqlTypes.KeyConnection,
    args: connectionArgs,
    resolve: (base, args) => connectionFromArray(db.getKeys(), args),
  };

  // ------------------------
  // Mutations and subscriptions
  // ------------------------
  {
    const parent = {
      type: 'Viewer',
      connection: 'keys',
      resolveConnection: () => db.getKeys(),
    };

    addMutation('Key', 'UPDATE');

    gqlMutations.parseSrcFiles = mutationWithClientMutationId({
      name: 'ParseSrcFiles',
      inputFields: {
        storyId: { type: GraphQLString },
      },
      mutateAndGetPayload: async ({ storyId }) => {
        const story = mainStory.child({
          src: 'gql',
          title: 'Mutation: parse source files',
          extraParents: storyId,
        });
        try {
          await db.parseSrcFiles({ story });
          return {};
        } finally {
          story.close();
        }
      },
      outputFields: {
        keys: keysBaseField,
        viewer: viewerRootField,
      },
    });

    addSubscription('Key', 'CREATED', gqlTypes, gqlSubscriptions, { parent });
    addSubscription('Key', 'UPDATED', gqlTypes, gqlSubscriptions);
  }

  // ==============================================
  // Translations
  // ==============================================
  gqlTypes.Translation = new GraphQLObjectType({
    name: 'Translation',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id: globalIdField('Translation'),
      isDeleted: { type: GraphQLBoolean },
      lang: { type: new GraphQLNonNull(GraphQLString) },
      translation: { type: new GraphQLNonNull(GraphQLString) },
      fuzzy: { type: GraphQLBoolean },
      keyId: {
        type: new GraphQLNonNull(GraphQLID),
        resolve: o => toGlobalId('Key', o.keyId),
      },
    }),
  });

  gqlTypes.TranslationCreate = new GraphQLInputObjectType({
    name: 'TranslationCreate',
    fields: () => ({
      lang: { type: new GraphQLNonNull(GraphQLString) },
      translation: { type: new GraphQLNonNull(GraphQLString) },
      fuzzy: { type: GraphQLBoolean },
      keyId: { type: new GraphQLNonNull(GraphQLID) },
    }),
  });

  gqlTypes.TranslationUpdate = new GraphQLInputObjectType({
    name: 'TranslationUpdate',
    fields: () => ({
      isDeleted: { type: GraphQLBoolean },
      translation: { type: GraphQLString },
      fuzzy: { type: GraphQLBoolean },
    }),
  });

  addConnectionType('Translation');

  // ------------------------
  // Mutations and subscriptions
  // ------------------------
  {
    const globalIds = ['keyId'];
    const parent = {
      type: 'Key',
      connection: 'translations',
      resolveConnection: key => db.getKeyTranslations(key.id),
    };

    addMutation('Translation', 'CREATE', { globalIds, parent });
    addMutation('Translation', 'UPDATE', { globalIds });

    addSubscription('Translation', 'UPDATED', gqlTypes, gqlSubscriptions);
  }

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
      fields: () =>
        pick(gqlMutations, [
          'updateConfig',
          'updateKey',
          'parseSrcFiles',
          'createTranslationInKeyTranslations',
          'updateTranslation',
        ]),
    }),

    subscription: new GraphQLObjectType({
      name: 'Subscription',
      fields: () =>
        pick(gqlSubscriptions, [
          'updatedConfig',
          'createdKeyInViewerKeys',
          'updatedKey',
          'updatedTranslation',
        ]),
    }),
  });

  return gqlSchema;
};

// ==============================================
// Relay-related helpers
// ==============================================
function getNodeType(node: ?Object): ?Object {
  if (!node) return null;
  return gqlTypes[node._type];
}

function getNodeFromGlobalId(globalId: ?string): ?Object {
  if (globalId == null) return null;
  const { type, id } = fromGlobalId(globalId);
  return getNodeFromTypeAndLocalId(type, id);
}

function getNodeFromTypeAndLocalId(type: string, localId: string): ?Object {
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

function addTypeAttr(obj: ?Object, type: string): ?Object {
  return obj ? timmSet(obj, '_type', type) : obj;
}

function addConnectionType(name: string): void {
  const { connectionType, edgeType } = connectionDefinitions({
    name,
    nodeType: gqlTypes[name],
  });
  gqlTypes[`${name}Connection`] = connectionType;
  gqlTypes[`${name}Edge`] = edgeType;
}

type MutationType = 'CREATE' | 'UPDATE';
type OperationParent = {
  type: string,
  connection: string,
  resolveConnection: (base: Object) => Array<Object>,
};
type MutationOptions = {
  fSingleton?: boolean,
  globalIds?: Array<string>,
  parent?: OperationParent,
};

type SubscriptionType = 'CREATED' | 'UPDATED';
type SubscriptionOptions = {
  parent?: OperationParent,
};

const addSubscription = (
  type: string,
  op: SubscriptionType,
  allTypes: Object,
  allSubscriptions: Object,
  options?: SubscriptionOptions = {}
) => {
  const { parent: parentSpec } = options;
  const baseName = operationBaseName(type, op, parentSpec);

  // Args
  const argSpecs = {};
  if (parentSpec) argSpecs.parentId = { type: new GraphQLNonNull(GraphQLID) };

  // Output fields
  // - `viewer`
  // - `typeName`
  // - [`parent`]
  // - [`createdTypeNameEdge`]
  const outputFields = {};
  outputFields.viewer = viewerRootField;
  outputFields[lowerFirst(type)] = { type: allTypes[type] };
  if (parentSpec) {
    outputFields.parent = { type: allTypes[parentSpec.type] };
    if (op === 'CREATED') {
      outputFields[`created${type}Edge`] = {
        type: allTypes[`${type}Edge`],
        resolve: payload => {
          const parentNode = payload.parent;
          const node = payload[lowerFirst(type)];
          if (!node) return null;
          const allNodes = parentSpec.resolveConnection(parentNode);
          const nodeId = node.id;
          const idx = allNodes.findIndex(o => o.id === nodeId);
          const cursor = idx >= 0 ? offsetToCursor(idx) : null;
          return { cursor, node };
        },
      };
    }
  }

  // Save subscription
  allSubscriptions[lowerFirst(baseName)] = {
    type: new GraphQLObjectType({
      name: `${baseName}Payload`,
      fields: () => outputFields,
    }),
    args: Object.keys(argSpecs).length ? argSpecs : undefined,
    resolve: (payload0, args) => {
      let payload = payload0;
      if (parentSpec) {
        const { parentId: globalParentId } = args;
        const parentNode = getNodeFromGlobalId(globalParentId);
        payload = timmSet(payload, 'parent', parentNode);
      }
      return payload;
    },
    subscribe: () => subscribe(lowerFirst(`${capitalize(op)}${type}`)),
  };
};

function addMutation(
  type: string,
  op: MutationType,
  options?: MutationOptions = {}
): void {
  const { parent } = options;
  const name = operationBaseName(type, op, parent);

  // Input fields
  const inputFields = {};
  if (op !== 'CREATE' && !options.fSingleton) {
    inputFields.id = { type: new GraphQLNonNull(GraphQLID) };
  }
  inputFields.attrs = { type: gqlTypes[`${type}${capitalize(op)}`] };
  if (parent) inputFields.parentId = { type: new GraphQLNonNull(GraphQLID) };
  inputFields.storyId = { type: GraphQLString };

  // The operation
  const mutateAndGetPayload = async mutationArgs => {
    const { id: globalId, storyId } = mutationArgs;
    const story = mainStory.child({
      src: 'gql',
      title: `Mutation: ${name} ${globalId || ''}`,
      extraParents: storyId,
    });
    try {
      return mutate(type, op, mutationArgs, options, story);
    } finally {
      story.close();
    }
  };

  // Output fields
  // - `viewer`
  // - `typeName`
  // - [`parent`] [if in args, typically in CREATE]
  // - [`createdTypeNameEdge`]
  const outputFields = {};
  outputFields.viewer = viewerRootField;
  outputFields[lowerFirst(type)] = {
    type: gqlTypes[type],
    resolve: ({ node }) => node,
  };
  if (parent) {
    outputFields.parent = {
      type: gqlTypes[parent.type],
      resolve: ({ parentNode }) => parentNode,
    };
    if (op === 'CREATE') {
      outputFields[`created${type}Edge`] = {
        type: gqlTypes[`${type}Edge`],
        resolve: ({ node, parentNode }) => {
          if (!node) return null;
          const allNodes = parent.resolveConnection(parentNode);
          const nodeId = node.id;
          const idx = allNodes.findIndex(o => o.id === nodeId);
          const cursor = idx >= 0 ? offsetToCursor(idx) : null;
          return { cursor, node };
        },
      };
    }
  }

  // Save mutation
  gqlMutations[lowerFirst(name)] = mutationWithClientMutationId({
    name,
    inputFields,
    mutateAndGetPayload,
    outputFields,
  });
}

const operationBaseName = (
  type: string,
  op: string,
  parent: ?OperationParent
) =>
  parent != null
    ? `${capitalize(op)}${type}In${parent.type}${upperFirst(parent.connection)}`
    : `${capitalize(op)}${type}`;

type InnerMutationArgs = {
  id: string,
  parentId: string,
  attrs?: Object,
};

type InnerMutationResult = {
  globalId: string,
  localId: ?string,
  globalParentId: string,
  parentNode: ?Object,
  node: ?Object,
};

async function mutate(
  type: string,
  op: MutationType,
  mutationArgs: InnerMutationArgs,
  options: MutationOptions,
  story: StoryT
): Promise<InnerMutationResult> {
  const { id: globalId, parentId: globalParentId, attrs } = mutationArgs;
  const localId =
    op !== 'CREATE' && !options.fSingleton ? fromGlobalId(globalId).id : null;
  const parentNode = getNodeFromGlobalId(globalParentId);
  const result: InnerMutationResult = {
    globalId,
    localId,
    globalParentId,
    parentNode,
    node: null,
  };
  let newAttrs: any = attrs;
  newAttrs = resolveGlobalIds(newAttrs, options.globalIds);
  if (op === 'CREATE') {
    result.node = await db[`create${type}`](newAttrs, { story });
    result.localId = result.node.id;
  } else {
    /* UPDATE */
    result.node = options.fSingleton
      ? await db[`update${type}`](newAttrs, { story })
      : await db[`update${type}`](localId, newAttrs, { story });
  }
  result.node = addTypeAttr(result.node, type);
  return result;
}

// Recursively solve all global IDs to their corresponding local ones
function resolveGlobalIds(
  prevAttrs: Object,
  globalIds: Array<string> = []
): Object {
  let attrs = prevAttrs;
  if (attrs == null || !globalIds.length) return attrs;
  for (let i = 0; i < globalIds.length; i++) {
    const locatorPath = globalIds[i];
    const tokens = locatorPath.split('.');
    const curToken = tokens[0];
    if (tokens.length === 1) {
      const globalId = attrs[curToken];
      if (globalId == null) continue;
      attrs = timmSet(attrs, curToken, fromGlobalId(globalId).id);
    } else {
      const subLocatorPath = tokens.slice(1).join('.');
      if (curToken === '*') {
        for (let idx = 0; idx < attrs.length; idx++) {
          attrs = timmSet(
            attrs,
            idx,
            resolveGlobalIds(attrs[idx], [subLocatorPath])
          );
        }
      } else {
        attrs = timmSet(
          attrs,
          curToken,
          resolveGlobalIds(attrs[curToken], [subLocatorPath])
        );
      }
    }
  }
  return attrs;
}

// function getTypePlural(type: string): string { return `${type}s`; } // obviously, a stub

// ==============================================
// Public
// ==============================================
export { getSchema, getSchemaShorthand, runQuery, runIntrospect, init };
