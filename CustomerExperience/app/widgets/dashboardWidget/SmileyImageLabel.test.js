import React from 'react';
import {render} from '@testing-library/react-native';
import SmileyImageLabel from './SmileyImageLabel';

const MockSvgComponent = () => null;

describe('SmileyImageLabel Component', () => {
  it('renders the no-view placeholder when datum.y is 0', () => {
    const {getByTestId} = render(
      <SmileyImageLabel
        x={0}
        y={0}
        index={0}
        datum={{y: 0, SvgComponent: MockSvgComponent}}
      />,
    );
    const image = getByTestId('no-view');
    expect(image).toBeTruthy();
  });

  it('renders the label-container with SvgComponent when datum.y is non-zero', () => {
    const {getByTestId} = render(
      <SmileyImageLabel
        x={0}
        y={0}
        index={0}
        datum={{y: 1, SvgComponent: MockSvgComponent}}
      />,
    );
    const image = getByTestId('label-container');
    expect(image).toBeTruthy();
  });
});
