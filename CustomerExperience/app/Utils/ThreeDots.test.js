import React from 'react';
import {render} from '@testing-library/react-native';
import ThreeDot from './ThreeDots';

describe('ThreeDot Component', () => {
  test('should render without crashing', () => {
    const {getByTestId} = render(<ThreeDot color="blue" />);
    const container = getByTestId('three-dot-container');
    expect(container).toBeTruthy();
  });

  test('should render three dots', () => {
    const {getAllByTestId} = render(<ThreeDot color="blue" />);
    const dots = getAllByTestId('circle-dot');
    expect(dots.length).toBe(3);
  });

  test('should render dots with the correct color', () => {
    const color = 'red';
    const {getAllByTestId} = render(<ThreeDot color={color} />);
    const dots = getAllByTestId('circle-dot');

    dots.forEach(dot => {
      expect(dot.props.style).toContainEqual({backgroundColor: color});
    });
  });
});
