/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { _Settings as Settings } from '../../src/client/components/080-settings';

jest.mock('react-dom');

describe('Settings', () => {
  it('renders correctly', () => {
    const viewer = {
      id: 'me',
      config: {
        langs: ['en', 'es'],
        srcPaths: ['src'],
        srcExtensions: ['.js', '.jsx'],
        msgFunctionNames: ['_t'],
        fMinify: false,
      },
    };
    const tree = renderer.create(
      <Settings
        lang="en"
        viewer={viewer}
        onChangeLang={() => {}}
        onClose={() => {}}
      />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
