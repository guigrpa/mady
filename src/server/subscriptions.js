import { PubSub } from 'graphql-subscriptions';

const pubSub = new PubSub();

const subscribe = name => pubSub.asyncIterator(name);
const publish = (name, payload) => {
  pubSub.publish(name, payload);
};

export { subscribe, publish };
