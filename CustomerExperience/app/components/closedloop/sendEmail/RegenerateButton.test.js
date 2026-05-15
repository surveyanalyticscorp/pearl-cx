import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import RegenerateButton from './RegenerateButton';

describe('RegenerateButton', () => {
  it('renders Regenerate label', () => {
    const {getByText} = render(<RegenerateButton onPress={jest.fn()} />);
    expect(getByText('Regenerate')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {UNSAFE_getByType} = render(<RegenerateButton onPress={onPress} />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(onPress).toHaveBeenCalled();
  });

  it('applies compact style when isSmallScreen is true', () => {
    const {getByText} = render(
      <RegenerateButton onPress={jest.fn()} isSmallScreen={true} />,
    );
    expect(getByText('Regenerate')).toBeTruthy();
  });
});
