import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import configureStore from 'redux-mock-store';
import {Provider} from 'react-redux';
import AssigneeBottomSheet from './AssigneeBottomSheet';
import useUpdateTicket from '../hooks/useUpdateTicket';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {snapTo} from 'reanimated-bottom-sheet';
import {View, Text} from 'react-native';

jest.mock('../hooks/useUpdateTicket', () => jest.fn());
jest.mock('../../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockStore = configureStore([]);
const mockRef = {
  current: {
    snapTo: snapTo,
  },
};

describe('AssigneeBottomSheet', () => {
  const mockOwners = [
    {ownerID: 1, name: 'John Doe'},
    {ownerID: 2, name: 'Jane Smith'},
  ];
  const assignToId = 2;
  const mockUpdateTicket = jest.fn();
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

    useUpdateTicket.mockReturnValue(mockUpdateTicket);
    jest.clearAllMocks();
  });

  it('renders header and SelectTicketOwner with correct props', () => {
    const {getByText, getByTestId} = render(
      <Provider store={store}>
        <AssigneeBottomSheet ref={mockRef} fall={{}} />
      </Provider>,
    );

    expect(getByText('ticket_overview.select_ticket_owner')).toBeTruthy();
    expect(getByTestId('SelectTicketOwner')).toBeTruthy();
  });

  it('triggers updateTicket and snapTo on owner selection', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AssigneeBottomSheet ref={mockRef} fall={{}} />
      </Provider>,
    );

    const takeActionButton = getByTestId('TakeActionButton');
    fireEvent(takeActionButton, 'press');

    expect(mockUpdateTicket).toHaveBeenCalled();
    expect(snapTo).toHaveBeenCalled();
  });

  it('closes bottom sheet when close button is pressed in header', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AssigneeBottomSheet ref={mockRef} fall={{}} />
      </Provider>,
    );

    fireEvent.press(getByTestId('close-button'));
    expect(snapTo).toHaveBeenCalled();
  });
});
