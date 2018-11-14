/* eslint-env browser */

import 'isomorphic-fetch';
import Relay from 'relay-runtime';
import socketio from 'socket.io-client';

// ===================================================
// Main
// ===================================================
let environment;
let inspector;

const createEnvironment = (
  records,
  fetchQuery = defaultFetchQuery,
  subscribe = defaultSubscribe
) => {
  const source = new Relay.RecordSource(records);
  const store = new Relay.Store(source);
  environment = new Relay.Environment({
    network:
      subscribe != null
        ? Relay.Network.create(fetchQuery, subscribe)
        : Relay.Network.create(fetchQuery),
    store,
  });
  // Debugging
  inspector =
    process.env.NODE_ENV !== 'production'
      ? new Relay.RecordSourceInspector(source)
      : null;
  return environment;
};

const getEnvironment = () => environment;
const getInspector = () => inspector;

// ===================================================
// Default network layer
// ===================================================
let socket;

// Map of operation name to observers ({ onNext, onError, onCompleted })
const subscriptionObservers = {};

if (!process.env.SERVER_SIDE_RENDERING) {
  socket = socketio.connect('/mady');
  socket.on('MESSAGE', msg => {
    const { type } = msg;
    if (type === 'NOTIF') {
      rxNotif(msg);
    }
  });
}

const rxNotif = msg => {
  // console.log('NOTIF', msg);
  const { subscriptionId, payload } = msg;
  const observers = subscriptionObservers[subscriptionId];
  if (!observers) return;
  observers.forEach(({ onNext }) => {
    onNext(payload);
  });
};

const defaultFetchQuery = async (operation, variables) => {
  const response = await fetch('/mady-graphql', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    }, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  });
  return response.json();
};

const defaultSubscribe = async (
  operation,
  variables,
  _ /* cacheConfig -- will always receive null */,
  observer
) => {
  // console.log(operation)
  if (!socket) {
    observer.onError(new Error('No socket available for subscriptions'));
    return;
  }
  const subscriptionId = operation.name;
  if (!subscriptionObservers[subscriptionId]) {
    subscriptionObservers[subscriptionId] = [];
    socket.emit('MESSAGE', {
      type: 'SUBSCRIBE',
      subscriptionId,
      query: operation.text,
      variables,
    });
  }
  const observers = subscriptionObservers[subscriptionId];
  observers.push(observer);
};

// ===================================================
// Public
// ===================================================
export default createEnvironment;
export { getEnvironment, getInspector };
