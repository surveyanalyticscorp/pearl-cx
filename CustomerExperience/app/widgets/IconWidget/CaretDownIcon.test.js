// write test cases for CaretDownIcon.js
import React from 'react';
import {render} from '@testing-library/react-native';
import CaretDownIcon from './CaretDownIcon';

describe('CaretDownIcon Component', () => {
  it('renders the CaretDownIcon with default size', () => {
    const {getByTestId} = render(<CaretDownIcon />);
    const image = getByTestId('caret-down-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the default size is applied
    expect(image.props.style.height).toBe(8);
    expect(image.props.style.width).toBe(12);
  });

  it('renders the CaretDownIcon with custom size', () => {
    const customHeight = 20;
    const customWidth = 10;
    const {getByTestId} = render(
      <CaretDownIcon height={customHeight} width={customWidth} />,
    );
    const image = getByTestId('caret-down-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the custom size is applied
    expect(image.props.style.height).toBe(customHeight);
    expect(image.props.style.width).toBe(customWidth);
  });

  it('renders the CaretDownIcon with the correct source', () => {
    const {getByTestId} = render(<CaretDownIcon />);
    const image = getByTestId('caret-down-icon');

    // Verify the correct source
    expect(image.props.source).toEqual(
      require('./../../../assets/images/caret_down.png'),
    );
  });
});
