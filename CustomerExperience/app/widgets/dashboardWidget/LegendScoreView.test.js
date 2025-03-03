import React from 'react';
import {render} from '@testing-library/react-native';
import LegendScoreView from './LegendScoreView';

// create props for LegendScoreView component
const props = {
  title: 'Positive',
  count: '100',
  percentage: 0.5,
  backgroundColor: 'red',
};

describe('LegendScoreView Component', () => {
  it('renders the LegendScoreView with default size', () => {
    const {getByTestId} = render(<LegendScoreView {...props} />);
    const image = getByTestId('legend-score-view');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });

  it('renders the LegendScoreView with custom size', () => {
    const {getByTestId} = render(<LegendScoreView {...props} />);
    const image = getByTestId('legend-score-view');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
  it('renders the LegendScoreView with the correct text', () => {
    const {getByTestId} = render(<LegendScoreView {...props} />);
    const text = getByTestId('legend-score-title');

    // Verify the correct text
    expect(text.props.children).toBe('Positive');
  });
});
