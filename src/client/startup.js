// @flow

/* eslint-env browser */
import moment from 'moment';
import { mainStory, addListener } from 'storyboard';
import wsClient from 'storyboard-listener-ws-client';
import browserExtension from 'storyboard-listener-browser-extension';
import React from 'react';
import ReactDOM from 'react-dom';
import createRelayEnvironment from './gral/relay';
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

// Bootstrap relay
const relayEnvironment = createRelayEnvironment(window.AppBootstrap.relayData);

ReactDOM.render(
  <App relayEnvironment={relayEnvironment} />,
  document.getElementById('mady-app')
);
