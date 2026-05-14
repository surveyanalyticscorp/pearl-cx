import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SendCommentButton from './SendCommentButton';

describe('SendCommentButton', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<SendCommentButton />);
    expect(toJSON()).toBeTruthy();
  });

  it('calls handleOnSubmit when pressed', () => {
    const mockOnSubmit = jest.fn();
    const {UNSAFE_getByType} = render(
      <SendCommentButton handleOnSubmit={mockOnSubmit} />,
    );
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(mockOnSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders without crashing when no onPress given', () => {
    const {toJSON} = render(<SendCommentButton />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts size prop without crashing', () => {
    const {toJSON} = render(<SendCommentButton size={32} />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts color prop without crashing', () => {
    const {toJSON} = render(<SendCommentButton color="#ff0000" />);
    expect(toJSON()).toBeTruthy();
  });

  it('accepts buttonStyle prop without crashing', () => {
    const {toJSON} = render(
      <SendCommentButton buttonStyle={{padding: 8, margin: 4}} />,
    );
    expect(toJSON()).toBeTruthy();
  });
});
