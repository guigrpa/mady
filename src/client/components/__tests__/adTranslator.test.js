/* eslint-env jest */
/* global document: false */
/* eslint-disable global-require, import/newline-after-import */
import React from 'react';
import renderer from 'react-test-renderer';
import { Floats } from 'giu';
import { _Translator as Translator } from '../adTranslator';
import {
  VIEWER,
  VIEWER_WITH_NO_CONTENT,
  KEY_WITH_TRANSLATIONS,
} from './fixtures';
import $ from './jestQuery';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');
jest.mock('../ecTranslatorHeader', () =>
  require('./mockComponent')('TranslatorHeader', {
    description: ({ langs }) => langs.join(','),
  })
);
const headerMatcher = node =>
  node.props && node.props.dataMockType === 'TranslatorHeader';
jest.mock('../edTranslatorRow', () =>
  require('./mockComponent')('TranslatorRow', {
    description: ({ fSelected }) => (fSelected ? 'selected' : 'unselected'),
  })
);
jest.mock('../../gral/storage');

// ======================================================
// Tests
// ======================================================
describe('Translator', () => {
  it('01 no content', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <Translator
            viewer={VIEWER_WITH_NO_CONTENT}
            changeSelectedKey={() => {}}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('02 selected row', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <Translator
            viewer={VIEWER}
            selectedKeyId={KEY_WITH_TRANSLATIONS.id}
            changeSelectedKey={() => {}}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('03 default columns', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <Translator viewer={VIEWER} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('04 fixed columns', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const tree = renderer
      .create(
        <div>
          <Floats />
          <Translator viewer={VIEWER} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('05 add column (it must correspond to a new language)', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <Translator viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();
    const headerComponent = $(tree, headerMatcher);
    expect(headerComponent).not.toBeNull();
    headerComponent.props.onAddLang();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('06 remove column', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <Translator viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();
    const headerComponent = $(tree, headerMatcher);
    expect(headerComponent).not.toBeNull();
    const fakeRemoveBtn = document.createElement('div');
    fakeRemoveBtn.id = '0';
    headerComponent.props.onRemoveLang({ currentTarget: fakeRemoveBtn });
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('07 change column language', () => {
    require('../../gral/storage').cookieSet('langs', ['ca', 'es']);
    const component = renderer.create(
      <div>
        <Floats />
        <Translator viewer={VIEWER} />
      </div>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    const headerComponent = $(tree, headerMatcher);
    expect(headerComponent).not.toBeNull();
    const fakeSelect = document.createElement('div');
    fakeSelect.id = '0';

    // Change the language ca -> en: changes the column
    headerComponent.props.onChangeLang({ currentTarget: fakeSelect }, 'en');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();

    // Change the language en -> es: removes the column, laves just one, 'e'
    headerComponent.props.onChangeLang({ currentTarget: fakeSelect }, 'es');
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
