import 'babel-polyfill';
import Promise              from 'bluebird';
import moment               from 'moment';
import {
  mainStory,
  addListener,
}                           from 'storyboard/lib/noPlugins';
import wsClient             from 'storyboard/lib/listeners/wsClient';
import browserExtension     from 'storyboard/lib/listeners/browserExtension';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Relay                from 'react-relay';
import App                  from './components/010-app';
import { ViewerQuery }      from './gral/rootQueries';
import _t                   from '../translate';

addListener(wsClient);
addListener(browserExtension);
if (process.env.NODE_ENV !== 'production') Promise.longStackTraces();

mainStory.info('startup', 'Launching...');

_t.setLocales(window.AppBootstrap.locales);
moment.locale(window.AppBootstrap.lang);

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new ViewerQuery()}
  />,
  document.getElementById('app')
);
