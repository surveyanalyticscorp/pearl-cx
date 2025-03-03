import React from 'react';
import {render} from '@testing-library/react-native';
import SmileyImageLabel from './SmileyImageLabel';

describe('SmileyImageLabel Component', () => {
  it('renders the SmileyImageLabel with default size', () => {
    const {getByTestId} = render(
      <SmileyImageLabel
        x={0}
        y={0}
        index={0}
        datum={{y: 0, imageSource: 'test-image-source'}}
      />,
    );
    const image = getByTestId('no-view');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });

  it('renders the SmileyImageLabel with custom size', () => {
    const {getByTestId} = render(
      <SmileyImageLabel
        x={0}
        y={0}
        index={0}
        datum={{y: 1, imageSource: 'test-image-source'}}
      />,
    );
    const image = getByTestId('label-container');

    // Check if the image is rendered
    expect(image).toBeTruthy();
  });
});
