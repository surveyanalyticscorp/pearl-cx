import React from 'react';
import {render, fireEvent, act} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import SendIcon from './SendIcon';
import {sendEmail} from '../../../redux/actions/closedloop.actions';
import {showErrorFlashMessage} from '../../../Utils/Utility';

jest.mock('../../../redux/actions/closedloop.actions', () => ({
  sendEmail: jest.fn(() => ({type: 'SEND_EMAIL'})), // Mocked action
}));

jest.mock('../../../Utils/Utility', () => ({
  showErrorFlashMessage: jest.fn(),
}));

// Create a mock Redux store
const mockStore = configureStore([]);

describe('SendIcon Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({
      dashboard: {
        mediaFileList: [{id: 'file1'}, {id: 'file2'}], // Ensure media files exist
      },
    });

    store.dispatch = jest.fn(); // Mock dispatch function
  });

  const flushPromises = () => new Promise(setImmediate);

  it('includes attachments when media files exist', async () => {
    const emailBody = {
      subject: 'Test Subject',
      emailBody: 'Test Body',
      ticketId: '123',
    };

    const {getByTestId} = render(
      <Provider store={store}>
        <SendIcon emailBody={emailBody} />
      </Provider>,
    );

    const sendButton = getByTestId('send-icon-button');

    await act(async () => {
      fireEvent.press(sendButton);
      await flushPromises(); // Ensure async updates are resolved
    });

    expect(store.dispatch).toHaveBeenCalledWith({
      type: 'SEND_EMAIL',
    });
  });
});
