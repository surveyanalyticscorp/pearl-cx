import React from 'react';
import {render} from '@testing-library/react-native';
import HorizontalScaleBar from './HorizontalScaleBar';

describe('HorizontalScaleBar Component', () => {
  it('renders the HorizontalScaleBar with default size', () => {
    const {getByTestId} = render(<HorizontalScaleBar value={0} />);
    const image = getByTestId('bar-label');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
});
