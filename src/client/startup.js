import 'babel-polyfill';
import Promise              from 'bluebird';
if (process.env.NODE_ENV !== 'production') {
  Promise.longStackTraces();
}
import { mainStory }        from 'storyboard';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Relay                from 'react-relay';
import App                  from './components/010-app';
import { ViewerQuery }      from './gral/rootQueries';

mainStory.info('startup', 'Launching...');

ReactDOM.render(
  <Relay.RootContainer
    Component={App}
    route={new ViewerQuery()}
  />,
  document.getElementById('app')
);
