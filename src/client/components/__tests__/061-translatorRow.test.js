/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { flexItem } from 'giu';
import { _HoverableTranslatorRow as HoverableTranslatorRow } from '../061-translatorRow';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../062-translation', () => jest.fn((props) => <div dataMockType="Translation" {...props} />));
// jest.mock('../062-translation', mockReactComponent('Translation'));

// ======================================================
// Fixtures
// ======================================================
const VIEWER = { id: 'me' };

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

const STYLE_KEY_COL = flexItem('1 1 0px', {
  backgroundColor: 'white',
  marginRight: 5,
  paddingLeft: 5,
  paddingRight: 17,
});

const STYLE_LANG_COL = flexItem('1 1 0px', {
  backgroundColor: 'white',
  marginRight: 5,
  paddingLeft: 5,
  paddingRight: 5,
});

// ======================================================
// Tests
// ======================================================
describe('HoverableTranslatorRow', () => {
  it('renders correctly a key without translations', () => {
    const tree = renderer.create(
      <HoverableTranslatorRow
        theKey={KEY_WITHOUT_TRANSLATIONS}
        viewer={VIEWER}
        langs={['es', 'ca']}
        fSelected={false}
        changeSelectedKey={() => {}}
        styleKeyCol={STYLE_KEY_COL}
        styleLangCol={STYLE_LANG_COL}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly a key with translations', () => {
    const tree = renderer.create(
      <HoverableTranslatorRow
        theKey={KEY_WITH_TRANSLATIONS}
        viewer={VIEWER}
        langs={['es', 'ca']}
        fSelected={false}
        changeSelectedKey={() => {}}
        styleKeyCol={STYLE_KEY_COL}
        styleLangCol={STYLE_LANG_COL}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly a selected key', () => {
    const tree = renderer.create(
      <HoverableTranslatorRow
        theKey={KEY_WITHOUT_TRANSLATIONS}
        viewer={VIEWER}
        langs={['es', 'ca']}
        fSelected
        changeSelectedKey={() => {}}
        styleKeyCol={STYLE_KEY_COL}
        styleLangCol={STYLE_LANG_COL}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('reacts to clicks, changing the selected key', () => {
    const spyChangeSelectedKey = jest.fn();
    const tree = renderer.create(
      <HoverableTranslatorRow
        theKey={KEY_WITHOUT_TRANSLATIONS}
        viewer={VIEWER}
        langs={['es', 'ca']}
        fSelected={false}
        changeSelectedKey={spyChangeSelectedKey}
        styleKeyCol={STYLE_KEY_COL}
        styleLangCol={STYLE_LANG_COL}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();

    // Click!
    tree.props.onClick();
    expect(spyChangeSelectedKey.mock.calls.length).toBe(1);
    expect(spyChangeSelectedKey.mock.calls[0][0]).toBe(KEY_WITHOUT_TRANSLATIONS.id);
  });
});
