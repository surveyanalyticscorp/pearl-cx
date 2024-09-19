import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import ResponseTicketCell from './ResponseTicketCell';
import moment from 'moment';

describe('ResponseTicketCell Component', () => {
  const mockData = {
    id: '12345',
    panelMember: {name: 'John Doe'},
    createdAt: '2023-09-12T00:00:00Z',
    comment: 'This is a test comment.',
    nps: 'Promoter',
    npsScore: 10,
    status: 1,
    priority: 2,
    userAvatar: 'https://example.com/avatar.png',
  };

  const onPressHandlerMock = jest.fn();

  it('renders correctly with provided data', () => {
    const {getByText} = render(
      <ResponseTicketCell
        data={mockData}
        onPressHandler={onPressHandlerMock}
      />,
    );

    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('This is a test comment.')).toBeTruthy();
    expect(
      getByText(` · ${moment(mockData.createdAt).format('MMMM DD, YYYY')}`),
    ).toBeTruthy();
  });

  it('calls onPressHandler when pressed', () => {
    const {getByTestId} = render(
      <ResponseTicketCell
        data={mockData}
        onPressHandler={onPressHandlerMock}
      />,
    );

    fireEvent.press(getByTestId('TouchableWithoutFeedback'));
    expect(onPressHandlerMock).toHaveBeenCalledWith(mockData, undefined); // Assuming index is undefined
  });

  it('displays the ticket ID', () => {
    const {getByText} = render(
      <ResponseTicketCell
        data={mockData}
        onPressHandler={onPressHandlerMock}
      />,
    );

    expect(getByText('Ticket ID #12345')).toBeTruthy();
  });
});
