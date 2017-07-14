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

const VIEWER_WITHOUT_KEY = {
  id: 'me',
};

const VIEWER_WITH_KEY_USED = {
  id: 'me',
  anyNode: {
    firstUsed: '2016-04-18T05:37:47.074Z',
    unusedSince: null,
    description: 'Some details',
    sources: ['src/client/components/060-translator.js'],
  },
};

const VIEWER_WITH_KEY_UNUSED = {
  id: 'me',
  anyNode: {
    firstUsed: '2016-04-18T05:37:47.074Z',
    unusedSince: '2016-04-21T05:37:47.074Z',
    description: 'Some details',
    sources: [],
  },
};

const RELAY_MOCK = {
  setVariables: jest.fn(),
};

// ======================================================
// Tests
// ======================================================
describe('Details', () => {
  it('renders correctly without a selection', () => {
    const tree = renderer
      .create(
        <Details
          relay={RELAY_MOCK}
          viewer={VIEWER_WITHOUT_KEY}
          selectedKeyId={null}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('renders correctly with a selection but no data yet', () => {
    const tree = renderer
      .create(
        <Details
          relay={RELAY_MOCK}
          viewer={VIEWER_WITHOUT_KEY}
          selectedKeyId={KEY_ID}
        />
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  describe('when the details for the selection are available', () => {
    it('renders correctly for a message that is used', () => {
      const tree = renderer
        .create(
          <Details
            relay={RELAY_MOCK}
            viewer={VIEWER_WITH_KEY_USED}
            selectedKeyId={KEY_ID}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });

    it('renders correctly for a message that is unused', () => {
      const tree = renderer
        .create(
          <Details
            relay={RELAY_MOCK}
            viewer={VIEWER_WITH_KEY_UNUSED}
            selectedKeyId={KEY_ID}
          />
        )
        .toJSON();
      expect(tree).toMatchSnapshot();
    });
  });
});
