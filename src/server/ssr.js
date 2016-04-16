import path                 from 'path';
import fs                   from 'fs';
import Promise              from 'bluebird';
import React                from 'react';
import Relay                from 'react-relay';
import ReactDOMServer       from 'react-dom/server';
import App                  from '../client/components/010-app';
import Modal                from '../client/components/910-modal';
import { ViewerQuery }      from '../client/gral/rootQueries';

let gqlServer;
let mainStory;

const SSR_CSS_PATH = path.resolve(process.cwd(), './lib/server/ssr/ssr.bundle.css');
const ssrCss = fs.readFileSync(SSR_CSS_PATH);


function processQuery(queryRequest, idx) {
  mainStory.debug('ssr', `Running query ${idx}...`);
  const query = queryRequest.getQueryString();
  const vars = queryRequest.getVariables();
  return gqlServer.runQuery(query, null, null, vars)
    .then(result => {
      let out;
      if (result.errors) {
        mainStory.error('ssr', 'SSR query failed', { attach: result.errors });
        out = queryRequest.reject(new Error('SSR_ERROR'));
      } else {
        mainStory.debug('ssr', 'SSR query succeeded');
        out = queryRequest.resolve({ response: result.data });
      }
      return out;
    })
    .catch(err => {
      mainStory.error('ssr', 'SSR query failed', { attach: err });
    });
}

export function init(options = {}) {
  gqlServer = options.gqlServer;
  mainStory = options.mainStory;
  if (!gqlServer || !mainStory) {
    throw new Error('Missing dependencies');
  }

  Relay.injectNetworkLayer({
    sendMutation: () => Promise.resolve(),
    sendQueries: queryReqs => {
      mainStory.debug('ssr', `Received ${queryReqs.length} queries`);
      return Promise.all(queryReqs.map(processQuery));
    },
    supports: () => false,
  });

  mainStory.info('ssr', 'Initialised');
}

export function render(req) {
  mainStory.info('ssr', 'Rendering...');
  const el = (
    <Relay.RootContainer
      Component={App}
      route={new ViewerQuery()}
    />
  );
  /* const el = <Modal>Hello</Modal>; */
  const ssrHtml = ReactDOMServer.renderToString(el);
  return {
    ssrHtml,
    ssrCss,
  };
}
