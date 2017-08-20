// @flow

/* eslint-disable no-param-reassign */

import { mainStory } from 'storyboard';
import {
  GraphQLID,
  GraphQLString,
  GraphQLFloat,
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
  connectionArgs,
  connectionFromArray,
  mutationWithClientMutationId,
} from 'graphql-relay';
import { pick } from 'lodash';
import {
  getViewer,
  getNodeType,
  getNodeFromGlobalId,
  addConnectionType,
  addMutation,
  addSubscription,
} from './relay';
import * as db from '../db';

const NonNullString = new GraphQLNonNull(GraphQLString);
const ArrayOfNonNullString = new GraphQLList(NonNullString);

// ==============================================
// Private state
// ==============================================
const gqlInterfaces = {};
const gqlTypes = {};
const gqlMutations = {};
const gqlSubscriptions = {};
const viewer = getViewer();
let gqlSchema;
let viewerRootField;
let statsBaseField;

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
    getNodeType(gqlTypes)
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
      stats: statsBaseField,
      keys: keysBaseField,
    }),
  });

  viewerRootField = {
    type: gqlTypes.Viewer,
    resolve: () => viewer,
  };

  // ==============================================
  // Stats
  // ==============================================
  gqlTypes.Stats = new GraphQLObjectType({
    name: 'Stats',
    interfaces: [gqlInterfaces.Node],
    isTypeOf: () => true,
    fields: () => ({
      id: globalIdField('Stats'),
      numTotalKeys: { type: new GraphQLNonNull(GraphQLFloat) },
      numUsedKeys: { type: new GraphQLNonNull(GraphQLFloat) },
      numTranslations: {
        type: new GraphQLList(
          new GraphQLObjectType({
            name: 'StatsForLang',
            fields: {
              lang: { type: new GraphQLNonNull(GraphQLString) },
              value: { type: new GraphQLNonNull(GraphQLFloat) },
            },
          })
        ),
      },
    }),
  });

  statsBaseField = {
    type: new GraphQLNonNull(gqlTypes.Stats),
    resolve: () => db.getStats(),
  };

  // ---------------------------
  // Subscriptions
  // ---------------------------
  addSubscription('Stats', 'UPDATED', gqlTypes, gqlSubscriptions, {
    outputFields: { viewer: viewerRootField },
  });

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

  // ---------------------------
  // Mutations and subscriptions
  // ---------------------------
  addMutation('Config', 'UPDATE', gqlTypes, gqlMutations, {
    fSingleton: true,
    outputFields: { viewer: viewerRootField, stats: statsBaseField },
  });
  addSubscription('Config', 'UPDATED', gqlTypes, gqlSubscriptions, {
    outputFields: { viewer: viewerRootField },
  });

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

  addConnectionType(gqlTypes, 'Key');

  keysBaseField = {
    type: gqlTypes.KeyConnection,
    args: connectionArgs,
    resolve: (base, args) => connectionFromArray(db.getKeys(), args),
  };

  // ---------------------------
  // Mutations and subscriptions
  // ---------------------------
  {
    const parent = {
      type: 'Viewer',
      connection: 'keys',
      resolveParent: () => viewer,
      resolveConnection: () => db.getKeys(),
    };

    addMutation('Key', 'UPDATE', gqlTypes, gqlMutations, {
      outputFields: { viewer: viewerRootField, stats: statsBaseField },
    });

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

    addSubscription('Key', 'CREATED', gqlTypes, gqlSubscriptions, {
      parent,
      outputFields: { viewer: viewerRootField },
    });
    addSubscription('Key', 'UPDATED', gqlTypes, gqlSubscriptions, {
      outputFields: { viewer: viewerRootField },
    });
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

  addConnectionType(gqlTypes, 'Translation');

  // ---------------------------
  // Mutations and subscriptions
  // ---------------------------
  {
    const globalIds = ['keyId'];
    const parent = {
      type: 'Key',
      connection: 'translations',
      resolveParent: translation => db.getKey(translation.keyId),
      resolveConnection: key => db.getKeyTranslations(key.id),
    };

    addMutation('Translation', 'CREATE', gqlTypes, gqlMutations, {
      globalIds,
      parent,
      outputFields: { viewer: viewerRootField, stats: statsBaseField },
    });
    addMutation('Translation', 'UPDATE', gqlTypes, gqlMutations, {
      globalIds,
      outputFields: { viewer: viewerRootField, stats: statsBaseField },
    });

    addSubscription('Translation', 'CREATED', gqlTypes, gqlSubscriptions, {
      parent,
      outputFields: { viewer: viewerRootField },
    });
    addSubscription('Translation', 'UPDATED', gqlTypes, gqlSubscriptions, {
      outputFields: { viewer: viewerRootField },
    });
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
          'updatedStats',
          'createdKeyInViewerKeys',
          'updatedKey',
          'createdTranslationInKeyTranslations',
          'updatedTranslation',
        ]),
    }),
  });

  return gqlSchema;
};

// ==============================================
// Public
// ==============================================
export { getSchema, getSchemaShorthand, runQuery, runIntrospect, init };
