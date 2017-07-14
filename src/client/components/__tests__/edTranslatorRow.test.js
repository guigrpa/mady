/* eslint-env jest */
/* eslint-disable global-require */
import React from 'react';
import renderer from 'react-test-renderer';
import { flexItem } from 'giu';
import { _HoverableTranslatorRow as HoverableTranslatorRow } from '../edTranslatorRow';
import {
  VIEWER,
  KEY_WITHOUT_TRANSLATIONS,
  KEY_WITH_TRANSLATIONS,
} from './fixtures';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../eeTranslation', () => require('./mockComponent')('Translation'));

// ======================================================
// Fixtures
// ======================================================
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
    const tree = renderer
      .create(
        <HoverableTranslatorRow
          theKey={KEY_WITHOUT_TRANSLATIONS}
          viewer={VIEWER}
          langs={['es', 'ca']}
          fSelected={false}
          changeSelectedKey={() => {}}
          styleKeyCol={STYLE_KEY_COL}
          styleLangCol={STYLE_LANG_COL}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly a key with translations', () => {
    const tree = renderer
      .create(
        <HoverableTranslatorRow
          theKey={KEY_WITH_TRANSLATIONS}
          viewer={VIEWER}
          langs={['es', 'ca']}
          fSelected={false}
          changeSelectedKey={() => {}}
          styleKeyCol={STYLE_KEY_COL}
          styleLangCol={STYLE_LANG_COL}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly a selected key', () => {
    const tree = renderer
      .create(
        <HoverableTranslatorRow
          theKey={KEY_WITHOUT_TRANSLATIONS}
          viewer={VIEWER}
          langs={['es', 'ca']}
          fSelected
          changeSelectedKey={() => {}}
          styleKeyCol={STYLE_KEY_COL}
          styleLangCol={STYLE_LANG_COL}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('reacts to clicks, changing the selected key', () => {
    const spyChangeSelectedKey = jest.fn();
    const tree = renderer
      .create(
        <HoverableTranslatorRow
          theKey={KEY_WITHOUT_TRANSLATIONS}
          viewer={VIEWER}
          langs={['es', 'ca']}
          fSelected={false}
          changeSelectedKey={spyChangeSelectedKey}
          styleKeyCol={STYLE_KEY_COL}
          styleLangCol={STYLE_LANG_COL}
        />
      )
      .toJSON();
    tree.props.onClick();
    expect(spyChangeSelectedKey).toBeCalledWith(KEY_WITHOUT_TRANSLATIONS.id);
  });
});
