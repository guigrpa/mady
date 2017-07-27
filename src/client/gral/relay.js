/* eslint-env browser */

import 'isomorphic-fetch';
import Relay from 'relay-runtime';
import socketio from 'socket.io-client';

let socket;
if (!process.env.SERVER_SIDE_RENDERING) {
  socket = socketio.connect();
  socket.on('MESSAGE', msg => {
    console.log('RX: ', msg);
  });
  // socket.emit('MESSAGE', {
  //   type: 'SUBSCRIBE',
  //   subscriptionId: 'updatedKey',
  //   query: 'subscription { updatedKey { key { text, isDeleted }}}',
  // });
}

const defaultFetchQuery = async (operation, variables) => {
  const response = await fetch('/graphql', {
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

let environment;
let inspector;

const createEnvironment = (records, fetchQuery = defaultFetchQuery) => {
  const source = new Relay.RecordSource(records);
  const store = new Relay.Store(source);
  environment = new Relay.Environment({
    network: Relay.Network.create(fetchQuery),
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
// Public
// ===================================================
export default createEnvironment;
export { getEnvironment, getInspector };
