// write test cases for DateFilterIcon.js
import React from 'react';
import {render} from '@testing-library/react-native';
import DateFilterIcon from './DateFilterIcon';

describe('DateFilterIcon Component', () => {
  it('renders the DateFilterIcon with default size', () => {
    const {getByTestId} = render(<DateFilterIcon />);
    const image = getByTestId('date-filter-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the default size is applied
    expect(image.props.style.width).toBe(24);
  });

  it('renders the DateFilterIcon with custom size', () => {
    const customSize = 40;
    const {getByTestId} = render(<DateFilterIcon size={customSize} />);
    const image = getByTestId('date-filter-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the custom size is applied
    expect(image.props.style.width).toBe(customSize);
  });

  it('renders the DateFilterIcon with the correct source', () => {
    const {getByTestId} = render(<DateFilterIcon />);
    const image = getByTestId('date-filter-icon');

    // Verify the correct source
    expect(image.props.source).toEqual(
      require('./../../../assets/images/date_filter_icon.png'),
    );
  });
});
