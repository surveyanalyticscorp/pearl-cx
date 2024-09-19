import React from 'react';
import {fireEvent, render} from '@testing-library/react-native';
import SelectTicketOwner from './SelectTicketOwner';

describe('SelectTicketOwner', () => {
  const mockData = [
    {ownerName: 'Owner 1'},
    {ownerName: 'Owner 2'},
    {ownerName: 'Owner 3'},
  ];
  const mockHandleOnPress = jest.fn();
  const defaultProps = {
    data: mockData,
    selectedIndex: 0,
    handleOnPress: mockHandleOnPress,
  };

  it('renders correctly with initial data', () => {
    const {getByText} = render(<SelectTicketOwner {...defaultProps} />);
    expect(getByText('Owner 1')).toBeTruthy();
    expect(getByText('Owner 2')).toBeTruthy();
    expect(getByText('Owner 3')).toBeTruthy();
  });

  it('filters the list based on search input', () => {
    const {getByPlaceholderText, queryByText} = render(
      <SelectTicketOwner {...defaultProps} />,
    );
    const searchInput = getByPlaceholderText('search');

    fireEvent.changeText(searchInput, 'Owner 2');
    expect(queryByText('Owner 1')).toBeNull();
    expect(queryByText('Owner 2')).toBeTruthy();
    expect(queryByText('Owner 3')).toBeNull();
  });

  it('resets the list when search input is cleared', () => {
    const {getByPlaceholderText, getByText} = render(
      <SelectTicketOwner {...defaultProps} />,
    );
    const searchInput = getByPlaceholderText('search');

    fireEvent.changeText(searchInput, 'Owner 2');
    fireEvent.changeText(searchInput, '');
    expect(getByText('Owner 1')).toBeTruthy();
    expect(getByText('Owner 2')).toBeTruthy();
    expect(getByText('Owner 3')).toBeTruthy();
  });

  it('selects an owner when row is pressed', () => {
    const {getByText, getByTestId} = render(
      <SelectTicketOwner {...defaultProps} />,
    );

    fireEvent.press(getByText('Owner 2'));
    expect(getByText('Owner 2')).toBeTruthy();
    fireEvent.press(getByTestId('QPButton'));
    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[1], 1);
  });

  it('displays no items found message when list is empty', () => {
    const {getByText} = render(
      <SelectTicketOwner {...defaultProps} data={[]} />,
    );
    expect(getByText('No Assignee/Owner found')).toBeTruthy();
  });

  it('calls handleOnPress with correct item on button press', () => {
    const {getByTestId} = render(<SelectTicketOwner {...defaultProps} />);
    fireEvent.press(getByTestId('QPButton'));
    expect(mockHandleOnPress).toHaveBeenCalledWith(mockData[0], 0);
  });
});
