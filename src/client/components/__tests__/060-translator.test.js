/* eslint-env jest */
/* eslint-disable global-require */
import React from 'react';
import renderer from 'react-test-renderer';
import { Floats } from 'giu';
import { _Translator as Translator } from '../060-translator';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../061-translatorRow', () => require('./mockComponent')('TranslatorRow'));
jest.mock('../../gral/storage');

// ======================================================
// Fixtures
// ======================================================
const KEY_WITHOUT_TRANSLATIONS = {
  id: 'keyId1',
  context: 'someContext',
  text: 'A message',
  unusedSince: null,
  // unusedSince: '2016-04-20T11:33:38.450Z',
  translations: { edges: [] },
};

const KEY_WITH_TRANSLATIONS = {
  id: 'keyId2',
  context: 'someContext',
  text: 'A message',
  unusedSince: null,
  translations: { edges: [
    { node: {
      id: 'translationId1',
      lang: 'es',
      translation: 'Un mensaje',
    } },
    { node: {
      id: 'translationId2',
      lang: 'ca',
      translation: 'Un missatge',
    } },
  ] },
};

const VIEWER = {
  id: 'me',
  config: {
    langs: ['es', 'ca', 'en'],
  },
  keys: { edges: [
    { node: KEY_WITHOUT_TRANSLATIONS },
    { node: KEY_WITH_TRANSLATIONS },
  ] },
};


// ======================================================
// Tests
// ======================================================
describe('Translator', () => {
  it('renders correctly with default columns', () => {
    const tree = renderer.create(
      <div>
        <Floats />
        <Translator
          viewer={VIEWER}
          changeSelectedKey={() => {}}
        />
      </div>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with fixed columns', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);

    const tree = renderer.create(
      <div>
        <Floats />
        <Translator
          viewer={VIEWER}
          changeSelectedKey={() => {}}
        />
      </div>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with fixed columns using up all available options', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es', 'en']);

    const tree = renderer.create(
      <div>
        <Floats />
        <Translator
          viewer={VIEWER}
          changeSelectedKey={() => {}}
        />
      </div>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a selection', () => {
    const tree = renderer.create(
      <div>
        <Floats />
        <Translator
          viewer={VIEWER}
          selectedKeyId={KEY_WITH_TRANSLATIONS.id}
          changeSelectedKey={() => {}}
        />
      </div>
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
