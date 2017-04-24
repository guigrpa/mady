/* eslint-env browser */

import Relay from 'relay-runtime';

const fetchQuery = async (operation, variables) => {
  const response = await fetch('/graphql', {
    method: 'POST',
    headers: {}, // Add authentication and other headers here
    body: JSON.stringify({
      query: operation.text, // GraphQL text from input
      variables,
    }),
  });
  return response.json();
};

const source = new Relay.RecordSource();
const store = new Relay.Store(source);
const network = Relay.Network.create(fetchQuery);
const environment = new Relay.Environment({ network, store });

export default environment;
