import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectStatus from './SelectStatus';
import {ApplyButton} from '../../../routes/commonUI/CommonUI';

jest.mock('../../../routes/commonUI/CommonUI', () => {
  const {Pressable, Text, View} = require('react-native');
  return {
    ApplyButton: jest.fn(({buttonText, onPress}) => (
      <Pressable testID="ApplyButton" onPress={onPress}>
        <Text>{buttonText}</Text>
      </Pressable>
    )),
    CheckBoxItem: jest.fn(({title, onPress}) => (
      <Pressable testID={`checkbox-${title}`} onPress={onPress}>
        <Text>{title}</Text>
      </Pressable>
    )),
    RadioButtonCheckbox: jest.fn(() => <View />),
    RenderStatusIcon: jest.fn(() => <View />),
  };
});

describe('SelectStatus', () => {
  const mockData = [
    {title: 'Open', value: 'open'},
    {title: 'Closed', value: 'closed'},
  ];
  const mockHandleOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

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
    const {getByTestId} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    fireEvent.press(getByTestId('ApplyButton'));

    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[0], 0);
  });

  it('should update the selected item when a status item is pressed', () => {
    const {getAllByTestId, getByTestId} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    const statusItems = getAllByTestId('status-item-button');
    fireEvent.press(statusItems[1]);

    fireEvent.press(getByTestId('ApplyButton'));

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
    const {getByTestId} = render(
      <SelectStatus
        data={mockData}
        selectedIndex={0}
        handleOnPress={mockHandleOnPress}
      />,
    );

    expect(getByTestId('ApplyButton')).toBeTruthy();
    expect(ApplyButton).toHaveBeenCalledWith(
      expect.objectContaining({buttonText: 'Update status'}),
      {},
    );
  });
});
