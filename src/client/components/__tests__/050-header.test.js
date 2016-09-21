/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import Header from '../050-header';

jest.mock('react-dom');

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Header onShowSettings={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });
});
