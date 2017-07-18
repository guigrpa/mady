// @flow

/* eslint-env browser */
import moment from 'moment';
import { mainStory, addListener } from 'storyboard';
import wsClient from 'storyboard-listener-ws-client';
import browserExtension from 'storyboard-listener-browser-extension';
import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/aaApp';
import _t from '../translate';

addListener(wsClient);
addListener(browserExtension);

mainStory.info('startup', 'Launching...');

// Process bootstrap: set up language and delete prerendered styles
_t.setLocales(window.AppBootstrap.locales);
moment.locale(window.AppBootstrap.lang);
const preRenderedStyles = document.getElementById('preRenderedStyles');
if (preRenderedStyles) {
  document.getElementsByTagName('head')[0].removeChild(preRenderedStyles);
}

ReactDOM.render(<App />, document.getElementById('app'));

// const rootElement = document.getElementById('app');
//
// if (window.AppBootstrap.relayData) {
//   const environment = Relay.Store;
//
//   // Comment out the following line if you find issues with the way the
//   // client-side Relay store is initialised (esp. wrt. mutations doing erratic things)
//   IsomorphicRelay.injectPreparedData(environment, window.AppBootstrap.relayData);
//
//   const rootContainerProps = {
//     Container: App,
//     queryConfig: new ViewerQuery(),
//   };
//   IsomorphicRelay.prepareInitialRender({ ...rootContainerProps, environment })
//   .then((props) => {
//     ReactDOM.render(<IsomorphicRelay.Renderer {...props} />, rootElement);
//   });
// } else {
//   ReactDOM.render(
//     <Relay.RootContainer
//       Component={App}
//       route={new ViewerQuery()}
//     />,
//     rootElement
//   );
// }
