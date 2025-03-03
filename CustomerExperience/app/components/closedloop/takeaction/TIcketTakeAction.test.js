import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import TicketTakeAction from './TicketTakeAction';

describe('TicketTakeAction Component', () => {
  const mockData = [
    {icon: 'check-circle', title: 'Approve'},
    {icon: 'cancel', title: 'Reject'},
    {icon: 'info', title: 'More Info'},
  ];

  const mockHandleOnPress = jest.fn();

  it('renders correctly', () => {
    const {getByTestId} = render(
      <TicketTakeAction data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Check if the container and flatlist are present
    expect(getByTestId('take-action-container')).toBeTruthy();
    expect(getByTestId('take-action-flatlist')).toBeTruthy();

    // Check if the first row's elements are rendered correctly
    expect(getByTestId('row-touchable-0')).toBeTruthy();
    expect(getByTestId('row-icon-0')).toBeTruthy();
    expect(getByTestId('row-title-0')).toBeTruthy();

    // Verify if the text content is correct
    expect(getByTestId('row-title-0').props.children).toBe('Approve');
    expect(getByTestId('row-title-1').props.children).toBe('Reject');
    expect(getByTestId('row-title-2').props.children).toBe('More Info');
  });

  it('calls handleOnPress with correct item when row is pressed', () => {
    const {getByTestId} = render(
      <TicketTakeAction data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Simulate press on the first item
    fireEvent.press(getByTestId('row-touchable-0'));

    // Check if handleOnPress was called with the correct item
    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[0]);

    // Simulate press on the second item
    fireEvent.press(getByTestId('row-touchable-1'));

    // Check if handleOnPress was called with the correct item
    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[1]);
  });

  it('renders the correct number of rows based on the data provided', () => {
    const {getAllByTestId} = render(
      <TicketTakeAction data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Check if the correct number of rows are rendered
    const rows = getAllByTestId(/row-touchable-/);
    expect(rows.length).toBe(mockData.length);
  });
});
