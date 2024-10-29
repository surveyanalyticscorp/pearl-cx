// write test cases for StatusIcon.js
import React from 'react';
import {render} from '@testing-library/react-native';
import StatusIcon from './StatusIcon';

describe('StatusIcon Component', () => {
  it('renders the StatusIcon with default size', () => {
    const {getByTestId} = render(<StatusIcon />);
    const image = getByTestId('status-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the default size is applied
    expect(image.props.style.width).toBe(24);
    expect(image.props.style.height).toBe(24);
  });

  it('renders the StatusIcon with custom size', () => {
    const customSize = 40;
    const {getByTestId} = render(<StatusIcon size={customSize} />);
    const image = getByTestId('status-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the custom size is applied
    expect(image.props.style.width).toBe(customSize);
    expect(image.props.style.height).toBe(customSize);
  });

  it('renders the StatusIcon with the correct source', () => {
    const {getByTestId} = render(<StatusIcon />);
    const image = getByTestId('status-icon');

    // Verify the correct source
    expect(image.props.source).toEqual(
      require('./../../../assets/images/responses_icon.png'),
    );
  });
});
