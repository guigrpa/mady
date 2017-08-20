// @flow

/* eslint-disable no-param-reassign */

import { set as timmSet } from 'timm';
import { mainStory } from 'storyboard';
import {
  GraphQLID,
  GraphQLString,
  GraphQLObjectType,
  GraphQLNonNull,
} from 'graphql';
import {
  fromGlobalId,
  connectionDefinitions,
  offsetToCursor,
  mutationWithClientMutationId,
} from 'graphql-relay';
import { capitalize, lowerFirst, upperFirst } from 'lodash';
import type { StoryT } from '../../common/types';
import { subscribe } from '../subscriptions';
import * as db from '../db';

const viewer = { _type: 'Viewer', id: 'me' };

type MutationType = 'CREATE' | 'UPDATE';
type MutationParent = {
  type: string,
  connection: string,
  resolveConnection: (base: Object) => Array<Object>,
};
type MutationOptions = {
  fSingleton?: boolean,
  globalIds?: Array<string>,
  parent?: MutationParent,
  outputFields?: Object,
};

type SubscriptionParent = {
  ...$Exact<MutationParent>,
  resolveParent: (base: Object) => ?Object,
};
type SubscriptionType = 'CREATED' | 'UPDATED';
type SubscriptionOptions = {
  parent?: SubscriptionParent,
  outputFields?: Object,
};

type OperationParent = MutationParent | SubscriptionParent;

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

// ==============================================
// Helper functions
// ==============================================
const getViewer = () => viewer;

const getNodeType = (allTypes: Object) => (node: ?Object): ?Object => {
  if (!node) return null;
  return allTypes[node._type];
};

const getNodeFromGlobalId = (globalId: ?string): ?Object => {
  if (globalId == null) return null;
  const { type, id } = fromGlobalId(globalId);
  return getNodeFromTypeAndLocalId(type, id);
};

const getNodeFromTypeAndLocalId = (type: string, localId: string): ?Object => {
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
};

const addTypeAttr = (obj: ?Object, type: string): ?Object =>
  obj ? timmSet(obj, '_type', type) : obj;

const addConnectionType = (allTypes: Object, name: string) => {
  const { connectionType, edgeType } = connectionDefinitions({
    name,
    nodeType: allTypes[name],
  });
  allTypes[`${name}Connection`] = connectionType;
  allTypes[`${name}Edge`] = edgeType;
};

const operationBaseName = (
  type: string,
  op: string,
  parent: ?OperationParent
) =>
  parent != null
    ? `${capitalize(op)}${type}In${parent.type}${upperFirst(parent.connection)}`
    : `${capitalize(op)}${type}`;

// Recursively solve all global IDs to their corresponding local ones
const resolveGlobalIds = (
  prevAttrs: Object,
  globalIds: Array<string> = []
): Object => {
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
};

// function getTypePlural(type: string): string { return `${type}s`; } // obviously, a stub

// ==============================================
// Mutations
// ==============================================
function addMutation(
  type: string,
  op: MutationType,
  allTypes: Object,
  allMutations: Object,
  options?: MutationOptions = {}
): void {
  const { parent } = options;
  const name = operationBaseName(type, op, parent);

  // Input fields
  const inputFields = {};
  if (op !== 'CREATE' && !options.fSingleton) {
    inputFields.id = { type: new GraphQLNonNull(GraphQLID) };
  }
  inputFields.attrs = { type: allTypes[`${type}${capitalize(op)}`] };
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
  // - Anything the caller asks for (e.g. `viewer`, `stats`)
  // - `typeName`
  // - [`parent`] [if in args, typically in CREATE]
  // - [`createdTypeNameEdge`]
  const outputFields = {
    ...(options.outputFields || {}),
  };
  outputFields[lowerFirst(type)] = {
    type: allTypes[type],
    resolve: ({ node }) => node,
  };
  if (parent) {
    outputFields.parent = {
      type: allTypes[parent.type],
      resolve: ({ parentNode }) => parentNode,
    };
    if (op === 'CREATE') {
      outputFields[`created${type}Edge`] = {
        type: allTypes[`${type}Edge`],
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
  allMutations[lowerFirst(name)] = mutationWithClientMutationId({
    name,
    inputFields,
    mutateAndGetPayload,
    outputFields,
  });
}

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

// ==============================================
// Subscriptions
// ==============================================
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
  // if (parentSpec) argSpecs.parentId = { type: new GraphQLNonNull(GraphQLID) };

  // Output fields
  // - `viewer`
  // - `typeName`
  // - [`parent`]
  // - [`createdTypeNameEdge`]
  const outputFields = {
    ...(options.outputFields || {}),
  };
  outputFields[lowerFirst(type)] = { type: allTypes[type] };
  if (parentSpec) {
    outputFields.parent = {
      type: allTypes[parentSpec.type],
      resolve: async payload => {
        const node = payload[lowerFirst(type)];
        if (!node) return null;
        return parentSpec.resolveParent(node);
      },
    };
  }
  if (parentSpec && op === 'CREATED') {
    outputFields[`created${type}Edge`] = {
      type: allTypes[`${type}Edge`],
      resolve: async payload => {
        const node = payload[lowerFirst(type)];
        if (!node) return null;
        const parentNode = await parentSpec.resolveParent(node);
        if (!parentNode) return null;
        const allNodes = parentSpec.resolveConnection(parentNode);
        const nodeId = node.id;
        const idx = allNodes.findIndex(o => o.id === nodeId);
        const cursor = idx >= 0 ? offsetToCursor(idx) : null;
        return { cursor, node };
      },
    };
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

// ==============================================
// Public
// ==============================================
export {
  getViewer,
  getNodeType,
  getNodeFromGlobalId,
  addConnectionType,
  addMutation,
  addSubscription,
};
