import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {RootCauseNavigationButtons} from './RootCauseNavigationButtons';

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockNavigate}),
}));
jest.mock('../../../widgets/Button', () => ({buttonText, onPress}) => {
  const {Pressable, Text} = require('react-native');
  return (
    <Pressable onPress={onPress} testID={`btn-${buttonText}`}>
      <Text>{buttonText}</Text>
    </Pressable>
  );
});

describe('RootCauseNavigationButtons', () => {
  beforeEach(() => mockNavigate.mockClear());

  it('renders both navigation buttons', () => {
    const {getByText} = render(<RootCauseNavigationButtons />);
    expect(getByText('Centralized')).toBeTruthy();
    expect(getByText('Previous root cause')).toBeTruthy();
  });

  it('navigates to CentralizedRootCause when Centralized pressed', () => {
    const {getByTestId} = render(<RootCauseNavigationButtons />);
    fireEvent.press(getByTestId('btn-Centralized'));
    expect(mockNavigate).toHaveBeenCalledWith('CentralizedRootCause');
  });

  it('navigates to OldRootCause when Previous root cause pressed', () => {
    const {getByTestId} = render(<RootCauseNavigationButtons />);
    fireEvent.press(getByTestId('btn-Previous root cause'));
    expect(mockNavigate).toHaveBeenCalledWith('OldRootCause');
  });
});
