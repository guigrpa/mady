import 'babel-polyfill';
import Promise              from 'bluebird';
import {
  mainStory,
  addListener,
}                           from 'storyboard';
import wsClient             from 'storyboard/lib/listeners/wsClient';
import browserExtension     from 'storyboard/lib/listeners/browserExtension';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Relay                from 'react-relay';
import App                  from './components/010-app';
import { ViewerQuery }      from './gral/rootQueries';

if (process.env.NODE_ENV === 'production') {
  addListener(wsClient);
  addListener(browserExtension);
} else {
  Promise.longStackTraces();
}

mainStory.info('startup', 'Launching...');

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new ViewerQuery()}
  />,
  document.getElementById('app')
);
