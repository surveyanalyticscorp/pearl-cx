import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import AssigneeBottomSheet from './AssigneeBottomSheet';
import useUpdateTicket from '../hooks/useUpdateTicket';

jest.mock('../hooks/useUpdateTicket', () => jest.fn());
jest.mock('../../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockStore = configureStore([]);

describe('AssigneeBottomSheet', () => {
  const mockOwners = [
    {ownerID: 1, ownerName: 'John Doe'},
    {ownerID: 2, ownerName: 'Jane Smith'},
  ];
  const assignToId = 2;
  const mockUpdateTicket = jest.fn();
  const mockOnClose = jest.fn();
  let store;

  beforeEach(() => {
    store = mockStore({
      dashboard: {
        ownerDetails: {
          owners: mockOwners,
        },
        ticket: {
          assignToId: assignToId,
        },
      },
    });

    mockOnClose.mockClear();
    mockUpdateTicket.mockClear();
    useUpdateTicket.mockReturnValue(mockUpdateTicket);
  });

  const renderComponent = () =>
    render(
      <Provider store={store}>
        <AssigneeBottomSheet visible={true} onClose={mockOnClose} />
      </Provider>,
    );

  it('renders header and SelectTicketOwner with correct props', () => {
    const {getByText, getByTestId} = renderComponent();

    expect(getByText('ticket_overview.select_ticket_owner')).toBeTruthy();
    expect(getByTestId('SelectTicketOwner')).toBeTruthy();
  });

  it('calls updateTicket and onClose when an owner is selected', () => {
    const {getByTestId} = renderComponent();

    fireEvent.press(getByTestId('TakeActionButton'));

    expect(mockUpdateTicket).toHaveBeenCalledWith({
      status: 2,
      assignToId: mockOwners[1].ownerID,
    });
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it('closes bottom sheet when close button is pressed in header', () => {
    const {getByTestId} = renderComponent();

    fireEvent.press(getByTestId('close-button'));

    expect(mockOnClose).toHaveBeenCalledTimes(1);
    expect(mockUpdateTicket).not.toHaveBeenCalled();
  });
});
