import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import InsertButton from './InsertButton';

jest.mock('../../../widgets/Button', () => ({buttonText, onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID="insert-button">
      <Text>{buttonText}</Text>
    </Pressable>
  );
});

describe('InsertButton', () => {
  it('renders with Insert label', () => {
    const {getByText} = render(<InsertButton onPress={jest.fn()} />);
    expect(getByText('Insert')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {getByTestId} = render(<InsertButton onPress={onPress} />);
    fireEvent.press(getByTestId('insert-button'));
    expect(onPress).toHaveBeenCalled();
  });
});
