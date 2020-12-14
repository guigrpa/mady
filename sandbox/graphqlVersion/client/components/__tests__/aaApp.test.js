/* eslint-env jest */
/* eslint-disable global-require, import/newline-after-import */
import React from 'react';
import renderer from 'react-test-renderer';
import { _App as App } from '../aaApp';
import { VIEWER_WITH_NO_CONTENT } from './fixtures';
import $ from './jestQuery';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../abHeader', () => require('./mockComponent')('Header'));
jest.mock('../adTranslator', () =>
  require('./mockComponent')('Translator', {
    description: ({ selectedKeyId }) => selectedKeyId || 'no selection',
  })
);
jest.mock('../aeSettings', () => require('./mockComponent')('Settings'));
jest.mock('../afDetails', () =>
  require('./mockComponent')('Details', {
    description: ({ selectedKeyId }) => selectedKeyId || 'no selection',
  })
);
jest.mock('../../gral/storage');
jest.mock('../fetchLangBundle');

describe('App', () => {
  it('01 no content', () => {
    const tree = renderer
      .create(<App viewer={VIEWER_WITH_NO_CONTENT} _disableHints />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('02 shows the settings when clicked', () => {
    const component = renderer.create(
      <App viewer={VIEWER_WITH_NO_CONTENT} _disableHints />
    );
    let tree = component.toJSON();

    const headerEl = $(tree, o => o.props.dataMockType === 'Header');
    expect(headerEl).not.toBeNull();
    headerEl.props.onShowSettings();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    const settingsEl = $(tree, o => o.props.dataMockType === 'Settings');
    expect(settingsEl).not.toBeNull();
    settingsEl.props.onClose();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('03 changes the selected key when clicked and shows details', () => {
    const component = renderer.create(
      <App viewer={VIEWER_WITH_NO_CONTENT} _disableHints />
    );
    let tree = component.toJSON();

    const translatorEl = $(tree, o => o.props.dataMockType === 'Translator');
    expect(translatorEl).not.toBeNull();
    translatorEl.props.changeSelectedKey('SELECTED_KEY');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('04 changes the application language', () => {
    const storage = require('../../gral/storage');
    const component = renderer.create(
      <App viewer={VIEWER_WITH_NO_CONTENT} _disableHints />
    );
    let tree = component.toJSON();

    const headerEl = $(tree, o => o.props.dataMockType === 'Header');
    expect(headerEl).not.toBeNull();
    headerEl.props.onShowSettings();
    tree = component.toJSON();

    const settingsEl = $(tree, o => o.props.dataMockType === 'Settings');
    expect(settingsEl).not.toBeNull();
    settingsEl.props.onChangeLang('ca');
    expect(storage.cookieGet('lang')).toBe('ca');
  });
});
