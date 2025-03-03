import React from 'react';
import {render} from '@testing-library/react-native';
import ScoreIndicatorIcon from './ScoreIndicatorIcon';

describe('ScoreIndicatorIcon Component', () => {
  it('renders the ScoreIndicatorIcon with diff -1', () => {
    const {getByTestId} = render(<ScoreIndicatorIcon diff={-1} />);
    const image = getByTestId('indicator-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });

  it('renders the ScoreIndicatorIcon with diff 1', () => {
    const {getByTestId} = render(<ScoreIndicatorIcon diff={1} />);
    const image = getByTestId('indicator-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
  it('renders the ScoreIndicatorIcon with diff 0', () => {
    const {getByTestId} = render(<ScoreIndicatorIcon diff={0} />);
    const image = getByTestId('no-view');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
});
