/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { _Details as Details } from '../afDetails';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');

// ======================================================
// Fixtures
// ======================================================
const KEY_ID = 'keyId';

const NODE_USED = {
  firstUsed: '2016-04-18T05:37:47.074Z',
  unusedSince: null,
  description: 'Some details',
  sources: ['src/client/components/060-translator.js'],
};

const NODE_UNUSED = {
  firstUsed: '2016-04-18T05:37:47.074Z',
  unusedSince: '2016-04-21T05:37:47.074Z',
  description: 'Some details',
  sources: [],
};

const NOW = new Date('2017-01-01T17:00:00.000Z');

// ======================================================
// Tests
// ======================================================
describe('Details', () => {
  it('01 no selection', () => {
    const tree = renderer
      .create(<Details node={null} selectedKeyId={null} _now={NOW} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('02 selection, but no data yet', () => {
    const tree = renderer
      .create(<Details node={null} selectedKeyId={KEY_ID} _now={NOW} />)
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('03 selection (and data are available):', () => {
    it('03a message that is used', () => {
      const tree = renderer
        .create(<Details node={NODE_USED} selectedKeyId={KEY_ID} _now={NOW} />)
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('03b message that is unused', () => {
      const tree = renderer
        .create(
          <Details node={NODE_UNUSED} selectedKeyId={KEY_ID} _now={NOW} />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
