/* eslint-env jest */
/* global document: false */
/* eslint-disable global-require, import/newline-after-import */
import React from 'react';
import renderer from 'react-test-renderer';
import { Floats } from 'giu';
import { _TranslatorHeader as TranslatorHeader } from '../ecTranslatorHeader';
import {
  VIEWER,
  // VIEWER_WITH_NO_CONTENT,
  // KEY_WITH_TRANSLATIONS,
} from './fixtures';
import $ from './jestQuery';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../edTranslatorRow', () =>
  require('./mockComponent')('TranslatorRow')
);
jest.mock('../../gral/storage');

// ======================================================
// Tests
// ======================================================
// describe('Translator', () => {
//   it('renders correctly with no content', () => {
//     const tree = renderer
//       .create(
//         <div>
//           <Floats />
//           <Translator
//             viewer={VIEWER_WITH_NO_CONTENT}
//             changeSelectedKey={() => {}}
//           />
//         </div>
//       )
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });
//
//   it('renders correctly with a selection', () => {
//     const tree = renderer
//       .create(
//         <div>
//           <Floats />
//           <Translator
//             viewer={VIEWER}
//             selectedKeyId={KEY_WITH_TRANSLATIONS.id}
//             changeSelectedKey={() => {}}
//           />
//         </div>
//       )
//       .toJSON();
//     expect(tree).toMatchSnapshot();
//   });
// });

describe.skip('TranslatorHeader', () => {
  it('renders correctly with default columns', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader viewer={VIEWER} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with fixed columns', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader viewer={VIEWER} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with fixed columns using up all available options', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es', 'en']);
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader viewer={VIEWER} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('when adding a column, it corresponds to a new language', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <TranslatorHeader viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();
    const addBtn = $(tree, '#madyBtnAddLang');
    expect(addBtn).not.toBeNull();
    addBtn.props.onClick();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('allows removing columns', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <TranslatorHeader viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();
    const langHeader = $(tree, '.madyLangHeader');
    expect(langHeader).not.toBeNull();
    const removeBtn = $(langHeader, '.fa-remove');
    expect(removeBtn).not.toBeNull();
    const removeBtnNode = document.createElement('div');
    removeBtnNode.id = '0';
    removeBtn.props.onClick({ currentTarget: removeBtnNode });
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('allows changing the language of a column', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <TranslatorHeader viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();

    let langHeader;
    let selectEl;

    const selectElNode = document.createElement('select');
    selectElNode.id = '0';

    // Change the language ca -> es: keeps just one column, 'es'
    langHeader = $(tree, '.madyLangHeader');
    expect(langHeader).not.toBeNull();
    selectEl = $(langHeader, '.giu-select');
    expect(selectEl).not.toBeNull();
    selectEl.props.onChange({ currentTarget: selectElNode }, '"es"');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // Change the language es -> en: changes the column
    langHeader = $(tree, '.madyLangHeader');
    expect(langHeader).not.toBeNull();
    selectEl = $(langHeader, '.giu-select');
    expect(selectEl).not.toBeNull();
    selectEl.props.onChange({ currentTarget: selectElNode }, '"en"');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
