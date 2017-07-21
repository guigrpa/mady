import path from 'path';
import fs from 'fs';
import React from 'react';
import Relay from 'relay-runtime';
import ReactDOMServer from 'react-dom/server';
import { setCurrentCookies } from '../client/gral/storage';
import App, { query as rootQuery } from '../client/components/aaApp';
import createRelayEnvironment from '../client/gral/relay';
import _t from '../translate';

let gqlServer: Object;
let mainStory: Object;

const SSR_CSS_PATH = path.resolve(__dirname, './ssr.bundle.css');
const ssrCss = fs.readFileSync(SSR_CSS_PATH);

const fetchQuery = async (operation /* , variables */) => {
  const query = operation.text;
  mainStory.debug('ssr', `Running query...`, {
    attach: query,
    attachLevel: 'trace',
  });
  try {
    const result = await gqlServer.runQuery(query);
    if (result.errors) {
      mainStory.error('ssr', 'SSR query failed', { attach: result.errors });
    } else {
      mainStory.debug('ssr', 'SSR query succeeded');
    }
    return result;
  } catch (err) {
    mainStory.error('ssr', 'SSR query failed', { attach: err });
    return null;
  }
};

const init = (options: { gqlServer: Object, mainStory: Object }) => {
  gqlServer = options.gqlServer;
  mainStory = options.mainStory;
  mainStory.info('ssr', 'Initialising...');
};

const render = async (req: Object, { fnLocales }: { fnLocales: string }) => {
  // Create a new environment for this user (with the server-side fetchQuery function)
  const environment = createRelayEnvironment(undefined, fetchQuery);

  // Load the data required for the initial render (rootQuery) into the environment
  await Relay.fetchQuery(environment, rootQuery, {});

  // Render with the cached data, making sure the language is correct
  mainStory.info('ssr', 'Rendering...');
  _t.setLocales(eval(fnLocales)); // eslint-disable-line no-eval
  setCurrentCookies(req.cookies);
  const ssrHtml = ReactDOMServer.renderToString(
    <App relayEnvironment={environment} />
  );

  // Return the cached data, which will be bootstrapped with the page
  // and re-hydrated by the client
  return { ssrHtml, ssrCss, relayData: environment.getStore().getSource() };
};

// ==============================================
// Public API
// ==============================================
export { init, render };
