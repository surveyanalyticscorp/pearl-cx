import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectPriority from './SelectPriority';

describe('SelectPriority Component', () => {
  const mockData = [{title: 'High'}, {title: 'Medium'}, {title: 'Low'}];

  const mockHandleOnPress = jest.fn();

  it('renders SelectPriority component correctly', () => {
    const {getByText} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    // Ensure all priority titles are rendered
    expect(getByText('High')).toBeTruthy();
    expect(getByText('Medium')).toBeTruthy();
    expect(getByText('Low')).toBeTruthy();
  });

  it('calls handleOnPress when Apply button is pressed', () => {
    const {getByText} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    // Change selection
    fireEvent.press(getByText('Medium'));

    // Press the Apply button
    fireEvent.press(getByText('Apply'));

    // Expect the mock function to have been called with the correct arguments
    expect(mockHandleOnPress).toHaveBeenCalledWith({title: 'Medium'}, 1);
  });

  it('displays a checkmark icon for the selected priority', () => {
    const {queryByTestId} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={1}
        handleOnPress={mockHandleOnPress}
      />,
    );

    // Check that only the Medium priority has the checkmark icon
    expect(queryByTestId('checkmark-icon-0')).toBeNull();
    expect(queryByTestId('checkmark-icon-1')).toBeTruthy();
    expect(queryByTestId('checkmark-icon-2')).toBeNull();
  });

  it('updates the selected priority when a new item is pressed', () => {
    const {getAllByTestId, queryByTestId} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    // Press the third priority
    fireEvent.press(getAllByTestId('priority-row')[2]);

    // Check that the third priority now has the checkmark icon
    expect(queryByTestId('checkmark-icon-2')).toBeTruthy();
    expect(queryByTestId('checkmark-icon-0')).toBeNull();
  });
});
