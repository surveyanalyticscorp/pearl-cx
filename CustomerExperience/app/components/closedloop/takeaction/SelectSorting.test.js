import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectSorting from './SelectSorting';
import {CheckRadioButtonItem} from '../../../routes/commonUI/CommonUI';

describe('SelectSorting', () => {
  const mockData = [
    {title: 'Sort by Date', value: 'date'},
    {title: 'Sort by Name', value: 'name'},
  ];
  const mockHandleOnPress = jest.fn();

  it('should render correctly', () => {
    const {getByText} = render(
      <SelectSorting
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    expect(getByText('Sort by date')).toBeTruthy();
    expect(getByText('Sort by name')).toBeTruthy();
  });

  it('should render the correct number of items', () => {
    const {getAllByTestId} = render(
      <SelectSorting
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const radioButtons = getAllByTestId('check-radio-button-item');
    expect(radioButtons.length).toBe(2);
  });

  it('should call handleOnPress with the correct item when first radio button is pressed', () => {
    const {getAllByTestId} = render(
      <SelectSorting
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const radioButtons = getAllByTestId('check-radio-button-item');
    fireEvent.press(radioButtons[0]);

    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[0], 0);
  });

  it('should call handleOnPress with the correct item when second radio button is pressed', () => {
    const {getAllByTestId} = render(
      <SelectSorting
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const radioButtons = getAllByTestId('check-radio-button-item');
    fireEvent.press(radioButtons[1]);

    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[1], 1);
  });
});
