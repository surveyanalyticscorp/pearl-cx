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

  it('displays a radio button for the selected priority', () => {
    const {getAllByTestId} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={1}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const priorityRows = getAllByTestId('priority-row');

    // Verify that the second priority row is selected
    expect(priorityRows[1]).toBeTruthy();
  });

  it('updates the selected priority when a new item is pressed', () => {
    const {getAllByTestId} = render(
      <SelectPriority
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const priorityRows = getAllByTestId('priority-row');

    // Press the third priority
    fireEvent.press(priorityRows[2]);

    // Press the Set priority button to confirm the selection
    fireEvent.press(getAllByTestId('ApplyButton')[0]);

    // Verify that handleOnPress was called with the correct arguments
    expect(mockHandleOnPress).toHaveBeenCalledWith({title: 'Low'}, 2);
  });
});
