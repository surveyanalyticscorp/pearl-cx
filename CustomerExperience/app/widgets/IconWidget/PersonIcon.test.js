import React from 'react';
import {render} from '@testing-library/react-native';
import PersonIcon from './PersonIcon';

describe('PersonIcon Component', () => {
  it('renders the PersonIcon with default size', () => {
    const {getByTestId} = render(<PersonIcon />);
    const image = getByTestId('person-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the default size is applied
    expect(image.props.style.width).toBe(24);
    expect(image.props.style.height).toBe(24);
  });

  it('renders the PersonIcon with custom size', () => {
    const customSize = 40;
    const {getByTestId} = render(<PersonIcon size={customSize} />);
    const image = getByTestId('person-icon');

    // Check if the image is rendered
    expect(image).toBeTruthy();

    // Verify the custom size is applied
    expect(image.props.style.width).toBe(customSize);
    expect(image.props.style.height).toBe(customSize);
  });

  it('renders the PersonIcon with the correct source', () => {
    const {getByTestId} = render(<PersonIcon />);
    const image = getByTestId('person-icon');

    // Verify the correct source
    expect(image.props.source).toEqual(
      require('./../../../assets/images/person_icon.png'),
    );
  });
});
