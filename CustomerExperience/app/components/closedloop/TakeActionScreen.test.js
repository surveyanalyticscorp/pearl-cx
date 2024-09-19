import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TakeActionScreen from './TakeActionScreen';
import {translate} from '../../Utils/MultilinguaUtils';
import {CloseButton} from '../../routes/commonUI/CommonUI';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

// Mock the imported components
jest.mock('../../routes/commonUI/CommonUI', () => ({
  CloseButton: jest.fn(() => null),
}));
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcon');
jest.mock('../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(),
}));

describe('TakeActionScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the header and close button correctly', () => {
    translate.mockReturnValue('Take Action');

    const {getByText} = render(<TakeActionScreen />);

    // Check that the header text is rendered correctly
    expect(getByText('Take Action')).toBeTruthy();

    // Verify that the CloseButton is rendered
    expect(CloseButton).toHaveBeenCalled();
  });

  it('renders the "Forward by Email" button', () => {
    const {getByText, getByTestId} = render(<TakeActionScreen />);

    // Verify that the "Forward by Email" button is rendered
    expect(getByText('Forward by Email')).toBeTruthy();

    // Verify that the MaterialIcon is rendered
    expect(getByTestId('MaterialIcon')).toBeTruthy();
  });

  it('triggers onPress event when "Forward by Email" is pressed', () => {
    const mockOnPress = jest.fn();

    const {getByTestId} = render(<TakeActionScreen onPress={mockOnPress} />);

    const forwardByEmailButton = getByTestId('button');

    // Simulate a press event
    fireEvent.press(forwardByEmailButton);

    // Verify that the press event is triggered
    expect(mockOnPress).toHaveBeenCalled();
  });
});
