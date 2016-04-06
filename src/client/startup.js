// @flow

import 'babel-polyfill';
import Promise              from 'bluebird';
if (process.env.NODE_ENV !== 'production') Promise.longStackTraces();
import { mainStory }        from 'storyboard';
import React                from 'react';
import ReactDOM             from 'react-dom';
import Relay                from 'react-relay';

mainStory.info('startup', 'Launching...');

// _t("exampleContext_Example string");
// _t("exampleContext_Number of items: {NUM}", NUM);
