import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import DeleteTicketModal from './DeleteTicketModal';

describe('DeleteTicketModal Component', () => {
  const setShowModalMock = jest.fn();

  it('renders correctly when modal is visible', () => {
    const {getByText} = render(
      <DeleteTicketModal
        showModal={true}
        setShowModal={setShowModalMock}
        ticketId="12345"
      />,
    );

    expect(getByText('12345')).toBeTruthy();
  });

  it('does not render when modal is not visible', () => {
    const {queryByText} = render(
      <DeleteTicketModal
        showModal={false}
        setShowModal={setShowModalMock}
        ticketId="12345"
      />,
    );

    expect(queryByText('12345')).toBeNull();
  });

  it('closes the modal on request close', () => {
    const {getByTestId} = render(
      <DeleteTicketModal
        showModal={true}
        setShowModal={setShowModalMock}
        ticketId="12345"
      />,
    );

    fireEvent(getByTestId('Modal'), 'requestClose');
    expect(setShowModalMock).toHaveBeenCalledWith(false);
  });
});
