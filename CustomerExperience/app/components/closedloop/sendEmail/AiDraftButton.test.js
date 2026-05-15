import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import AiDraftButton from './AiDraftButton';

jest.mock('../../../Utils/IconUtils', () => ({MaterialIcons: () => null}));

describe('AiDraftButton', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<AiDraftButton onPress={jest.fn()} />);
    expect(toJSON()).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const onPress = jest.fn();
    const {UNSAFE_getByType} = render(<AiDraftButton onPress={onPress} />);
    const {Pressable} = require('react-native');
    fireEvent.press(UNSAFE_getByType(Pressable));
    expect(onPress).toHaveBeenCalled();
  });
});
