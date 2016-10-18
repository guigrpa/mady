// @flow

import path                 from 'path';
import fs                   from 'fs';
import Promise              from 'bluebird';
import React                from 'react';
import IsomorphicRelay      from 'isomorphic-relay';
import ReactDOMServer       from 'react-dom/server';
import { setCurrentCookies } from '../client/gral/storage';
import App                  from '../client/components/010-app';
import { ViewerQuery }      from '../client/gral/rootQueries';
import _t                   from '../translate';

let gqlServer: Object;
let mainStory: Object;

const SSR_CSS_PATH = path.resolve(__dirname, './ssr.bundle.css');
const ssrCss = fs.readFileSync(SSR_CSS_PATH);

function processQuery(queryRequest: Object, idx: number): Promise {
  mainStory.debug('ssr', `Running query #${idx}...`);
  const query = queryRequest.getQueryString();
  const vars = queryRequest.getVariables();
  return gqlServer.runQuery(query, null, null, vars)
  .then((result) => {
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
  .catch((err) => {
    mainStory.error('ssr', 'SSR query failed', { attach: err });
  });
}

const networkLayer = {
  sendMutation: () => Promise.resolve(),
  sendQueries: (queryReqs: Array<any>): Promise => {
    mainStory.debug('ssr', `Received ${queryReqs.length} queries`);
    return Promise.all(queryReqs.map(processQuery));
  },
  supports: () => false,
};

function init(options: {
  gqlServer: Object,
  mainStory: Object,
}) {
  gqlServer = options.gqlServer;
  mainStory = options.mainStory;
  mainStory.info('ssr', 'Initialised');
}

function render(
  req: Object,
  { fnLocales }: { fnLocales: string },
): Promise {
  return Promise.resolve()
  .then(() => {
    mainStory.info('ssr', 'Rendering...');
    const rootContainerProps = {
      Container: App,
      queryConfig: new ViewerQuery(),
    };
    return IsomorphicRelay.prepareData(rootContainerProps, networkLayer);
  })
  .then(({ data: relayData, props }) => {
    // Everything here must be synchronous so that rendering works correctly!
    const el = <IsomorphicRelay.Renderer {...props} />;
    /* eslint-disable no-eval */
    _t.setLocales(eval(fnLocales));
    /* eslint-enable no-eval */
    setCurrentCookies(req.cookies);
    const ssrHtml = ReactDOMServer.renderToString(el);
    return { ssrHtml, ssrCss, relayData };
  });
}

// ==============================================
// Public API
// ==============================================
export {
  init,
  render,
};
