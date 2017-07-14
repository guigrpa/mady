/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Floats } from 'giu';
import { _HoverableTranslation as HoverableTranslation } from '../eeTranslation';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');

// ======================================================
// Fixtures
// ======================================================
const KEY = {
  id: 'keyId',
  text: 'A message',
};

const TRANSLATION = {
  id: 'translationId',
  lang: 'es',
  translation: 'Un mensaje',
};

// ======================================================
// Tests
// ======================================================
describe('HoverableTranslation', () => {
  it('renders correctly without translation', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <HoverableTranslation
            theKey={KEY}
            lang="es"
            translation={null}
            changeSelectedKey={() => {}}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with translation', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <HoverableTranslation
            theKey={KEY}
            lang="es"
            translation={TRANSLATION}
            changeSelectedKey={() => {}}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
