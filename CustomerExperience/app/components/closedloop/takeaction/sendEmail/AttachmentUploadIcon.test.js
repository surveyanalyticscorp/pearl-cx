import React from 'react';
import {render, fireEvent, waitFor, act} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import AttachmentUploadIcon from './AttachmentUploadIcon';
import {postUploadFile} from '../../../../redux/actions/closedloop.actions';
import DocumentPicker from 'react-native-document-picker';

// Create a mock Redux store
const mockStore = configureStore([]);
jest.mock('react-native-document-picker', () => ({
  pickSingle: jest.fn(),
}));

jest.mock('../../../../redux/actions/closedloop.actions', () => ({
  postUploadFile: jest.fn(),
}));

describe('AttachmentUploadIcon Component', () => {
  let store;

  beforeEach(() => {
    store = mockStore({});
    store.dispatch = jest.fn(); // Mock dispatch function
  });

  it('renders AttachmentUploadIcon correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <AttachmentUploadIcon />
      </Provider>,
    );

    expect(getByTestId('attachment-upload-icon')).toBeTruthy();
  });

  it('triggers file selection when pressed', async () => {
    DocumentPicker.pickSingle.mockResolvedValueOnce({
      uri: 'file://test-file.pdf',
      type: 'application/pdf',
      name: 'test-file.pdf',
    });

    const {getByTestId} = render(
      <Provider store={store}>
        <AttachmentUploadIcon />
      </Provider>,
    );

    const attachmentButton = getByTestId('attachment-upload-button');

    fireEvent.press(attachmentButton);
    await waitFor(() => {
      expect(DocumentPicker.pickSingle).toHaveBeenCalled();
    });
  });

  it('dispatches postUploadFile action when a file is selected', async () => {
    const mockFile = {
      uri: 'file://test-file.pdf',
      type: 'application/pdf',
      name: 'test-file.pdf',
    };

    DocumentPicker.pickSingle.mockResolvedValueOnce(mockFile);

    const {getByTestId} = render(
      <Provider store={store}>
        <AttachmentUploadIcon />
      </Provider>,
    );

    const attachmentButton = getByTestId('attachment-upload-button');

    await act(async () => {
      fireEvent.press(attachmentButton);
    });

    await waitFor(() => {
      expect(store.dispatch).toHaveBeenCalledWith(
        postUploadFile(expect.any(FormData)),
      );
    });
  });

  it('handles errors gracefully when file selection is canceled', async () => {
    DocumentPicker.pickSingle.mockRejectedValueOnce(new Error('User canceled'));

    const {getByTestId} = render(
      <Provider store={store}>
        <AttachmentUploadIcon />
      </Provider>,
    );

    const attachmentButton = getByTestId('attachment-upload-button');

    await act(async () => {
      fireEvent.press(attachmentButton);
    });

    await waitFor(() => {
      expect(DocumentPicker.pickSingle).toHaveBeenCalledTimes(1);
      expect(store.dispatch).not.toHaveBeenCalled();
    });
  });
});
