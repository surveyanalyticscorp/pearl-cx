import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {QPBottomSheetHeader} from '.';

describe('QPBottomSheetHeader', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders headerLabel text', () => {
    const {getByText} = render(
      <QPBottomSheetHeader headerLabel="Filter by" onClose={mockOnClose} />,
    );
    expect(getByText('Filter by')).toBeTruthy();
  });

  it('renders the close button', () => {
    const {getByTestId} = render(
      <QPBottomSheetHeader headerLabel="Title" onClose={mockOnClose} />,
    );
    expect(getByTestId('close-button')).toBeTruthy();
  });

  it('calls onClose when close button is pressed', () => {
    const {getByTestId} = render(
      <QPBottomSheetHeader headerLabel="Title" onClose={mockOnClose} />,
    );
    fireEvent.press(getByTestId('close-button'));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
