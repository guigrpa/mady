/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Hints } from 'giu';
import Header from '../abHeader';
import $ from './jestQuery';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');

describe('Header', () => {
  it('renders correctly', () => {
    const tree = renderer.create(
      <Header onShowSettings={() => {}} />
    ).toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('shows hints when the info button is clicked', () => {
    const component = renderer.create(
      <div>
        <Hints />
        <Header onShowSettings={() => {}} />
      </div>
    );
    let tree = component.toJSON();
    expect(tree).toMatchSnapshot();
    const infoBtn = $(tree, '.fa-question-circle');
    expect(infoBtn).not.toBeNull();
    infoBtn.props.onClick();
    tree = component.toJSON();
    expect(tree).toMatchSnapshot();
  });
});
