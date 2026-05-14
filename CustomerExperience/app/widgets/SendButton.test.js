import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SendButton from './SendButton';

describe('SendButton', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<SendButton />);
    expect(toJSON()).toBeTruthy();
  });

  it('calls handleOnSubmit when pressed', () => {
    const mockOnSubmit = jest.fn();
    const {UNSAFE_getByType} = render(
      <SendButton handleOnSubmit={mockOnSubmit} />,
    );
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('accepts size prop without crashing', () => {
    const {toJSON} = render(<SendButton size={32} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts color prop without crashing', () => {
    const {toJSON} = render(<SendButton color="#ff0000" />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts style prop without crashing', () => {
    const {toJSON} = render(<SendButton style={{margin: 8}} />);
    expect(toJSON()).toBeTruthy();
  });

  it('renders without crashing when no onPress given', () => {
    const {toJSON} = render(<SendButton />);
    expect(toJSON()).toBeTruthy();
  });
});
