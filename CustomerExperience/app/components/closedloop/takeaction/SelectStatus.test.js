import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectStatus from './SelectStatus';

describe('SelectStatus', () => {
  const mockData = [
    {title: 'Open', value: 'open'},
    {title: 'Closed', value: 'closed'},
  ];
  const mockHandleOnPress = jest.fn();

  it('should render correctly', () => {
    const {getByText} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    expect(getByText('Open')).toBeTruthy();
    expect(getByText('Closed')).toBeTruthy();
  });

  it('should call handleOnPress with the correct item and index when Apply button is pressed', () => {
    const {getByText} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const applyButton = getByText('Apply');
    fireEvent.press(applyButton);

    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[0], 0);
  });

  it('should update the selected item when a status item is pressed', () => {
    const {getAllByTestId, getByText} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const statusItems = getAllByTestId('status-item-button');
    fireEvent.press(statusItems[1]);

    const applyButton = getByText('Apply');
    fireEvent.press(applyButton);

    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[1], 1);
  });

  it('should render the correct number of items', () => {
    const {getAllByTestId} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const statusItems = getAllByTestId('status-item-button');
    expect(statusItems.length).toBe(2);
  });

  it('should display Apply button at the end of the list', () => {
    const {getByText} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const applyButton = getByText('Apply');
    expect(applyButton).toBeTruthy();
  });
});
