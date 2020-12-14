/* eslint-env jest */
import React from 'react';
import renderer from 'react-test-renderer';
import { Hints, Floats } from 'giu';
import Header from '../abHeader';
import $ from './jestQuery';

// https://github.com/facebook/react/issues/7386#issuecomment-238091398
jest.mock('react-dom');

describe('Header', () => {
  it('01 normal', () => {
    const tree = renderer
      .create(
        <div>
          <Floats />
          <Header onShowSettings={() => {}} scopes={[]} />
        </div>
      )
      .toJSON();
    expect(tree).toMatchSnapshot();
  });

  it('02 shows hints when the info button is clicked', () => {
    const component = renderer.create(
      <div>
        <Hints />
        <Floats />
        <Header onShowSettings={() => {}} scopes={[]} />
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
