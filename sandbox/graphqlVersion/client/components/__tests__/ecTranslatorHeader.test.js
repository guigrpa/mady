/* eslint-env jest */
/* eslint-disable global-require, import/newline-after-import */
import React from 'react';
import renderer from 'react-test-renderer';
import { Floats } from 'giu';
import { _TranslatorHeader as TranslatorHeader } from '../ecTranslatorHeader';
import {
  VIEWER,
  VIEWER_WITH_NO_CONTENT,
  STATS,
  STATS_WITH_NO_CONTENT,
} from './fixtures';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');

// ======================================================
// Tests
// ======================================================
describe('TranslatorHeader', () => {
  it('01 no content', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader
            langs={['ca', 'es']}
            availableLangs={['es', 'ca', 'en']}
            viewer={VIEWER_WITH_NO_CONTENT}
            stats={STATS_WITH_NO_CONTENT}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('02 normal', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader
            langs={['ca', 'es']}
            availableLangs={['es', 'ca', 'en']}
            viewer={VIEWER}
            stats={STATS}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('03 all columns shown', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <TranslatorHeader
            langs={['ca', 'es', 'en']}
            availableLangs={['es', 'ca', 'en']}
            viewer={VIEWER}
            stats={STATS}
          />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });
});
