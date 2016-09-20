/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../../src/client/components/050-header';

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Header onShowSettings={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
