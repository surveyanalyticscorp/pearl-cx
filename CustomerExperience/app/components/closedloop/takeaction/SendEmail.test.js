import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import SendEmail from './SendEmail';
import {useDispatch, useSelector} from 'react-redux';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import DocumentPicker from 'react-native-document-picker';
import {
  sendEmail,
  postUploadFile,
} from '../../../redux/actions/closedloop.actions';
import BottomSheet from 'reanimated-bottom-sheet';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: jest.fn()}),
}));
// Mock necessary modules
jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));
jest.spyOn(React, 'useRef').mockReturnValue({
  current: {
    snapTo: jest.fn(),
  },
});
jest.mock('react-native-pell-rich-editor', () => {
  const {TextInput} = require('react-native');

  return {
    RichEditor: jest
      .fn()
      .mockImplementation(({onChange}) => (
        <TextInput testID="rich-editor" onChangeText={onChange} />
      )),
    RichToolbar: 'RichToolbar',
    actions: {
      setBold: 'bold',
      setItalic: 'italic',
      setUnderline: 'underline',
      heading1: 'heading1',
      heading2: 'heading2',
      heading3: 'heading3',
      heading4: 'heading4',
      heading5: 'heading5',
      heading6: 'heading6',
      insertLine: 'line',
      setParagraph: 'paragraph',
    },
  };
});

jest.mock('react-native-document-picker', () => ({
  pickSingle: jest.fn(),
}));

jest.mock('reanimated-bottom-sheet', () => {
  return {
    __esModule: true,
    default: jest.fn().mockImplementation(({children}) => <>{children}</>),
  };
});

jest.mock('../../../redux/actions/closedloop.actions', () => ({
  sendEmail: jest.fn(),
  postUploadFile: jest.fn(),
}));

describe('SendEmail Component', () => {
  let mockDispatch;

  beforeEach(() => {
    mockDispatch = jest.fn();
    useDispatch.mockReturnValue(mockDispatch);
    useSelector.mockImplementation(callback => {
      return callback({
        dashboard: {
          emailData: {
            defaultTemplate: {},
            emailTemplates: [],
          },
          ticketActionHistory: {
            summary: {},
          },
          mediaFileList: [],
        },
        global: {
          authToken: 'testAuthToken',
        },
      });
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders SendEmail component correctly', () => {
    const {getByText, getByPlaceholderText} = render(
      <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
    );

    expect(getByText('Respond Via Email')).toBeTruthy();
    expect(getByText('Action History')).toBeTruthy();
    expect(getByPlaceholderText('Email subject')).toBeTruthy();
    expect(getByText('Attachments')).toBeTruthy();
  });

  // it('should update subject on user input', () => {
  //   const {getByPlaceholderText} = render(
  //     <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
  //   );

  //   const subjectInput = getByPlaceholderText('Email subject');
  //   fireEvent.changeText(subjectInput, 'New Subject');

  //   expect(subjectInput.props.value).toBe('New Subject');
  // });

  // it('should update email body on editor input', () => {
  //   const {getByTestId} = render(
  //     <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
  //   );

  //   const richEditor = getByTestId('rich-editor');
  //   fireEvent.changeText(richEditor, 'Email Body Content');

  //   expect(richEditor.props.value).toBe('Email Body Content');
  // });

  // it('should dispatch sendEmail action on Send button press', async () => {
  //   const {getByRole} = render(
  //     <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
  //   );

  //   const sendButton = getByRole('button', {name: 'send'});
  //   fireEvent.press(sendButton);

  //   await waitFor(() =>
  //     expect(mockDispatch).toHaveBeenCalledWith(sendEmail(expect.anything())),
  //   );
  // });

  // it('should show error if email subject is empty', async () => {
  //   const {getByRole} = render(
  //     <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
  //   );

  //   const sendButton = getByRole('button', {name: 'send'});
  //   fireEvent.press(sendButton);

  //   await waitFor(() =>
  //     expect(mockDispatch).not.toHaveBeenCalledWith(
  //       sendEmail(expect.anything()),
  //     ),
  //   );
  // });

  // it('should dispatch postUploadFile action when selecting attachment', async () => {
  //   DocumentPicker.pickSingle.mockResolvedValue({
  //     uri: 'file://test-file',
  //     type: 'application/pdf',
  //     name: 'test-file.pdf',
  //   });

  //   const {getByRole} = render(
  //     <SendEmail route={{params: {ticketId: 123, toEmail: 'test@test.com'}}} />,
  //   );

  //   const attachButton = getByRole('button', {name: 'attach'});
  //   fireEvent.press(attachButton);

  //   await waitFor(() =>
  //     expect(mockDispatch).toHaveBeenCalledWith(
  //       postUploadFile(expect.anything()),
  //     ),
  //   );
  // });

  // it('should navigate to actionEmailHistory on action history item press', () => {
  //   const mockNavigate = jest.fn();
  //   const {getByText} = render(
  //     <SendEmail
  //       navigation={{navigate: mockNavigate}}
  //       route={{params: {ticketId: 123, toEmail: 'test@test.com'}}}
  //     />,
  //   );

  //   const actionHistoryItem = getByText('Action History');
  //   fireEvent.press(actionHistoryItem);

  //   expect(mockNavigate).toHaveBeenCalledWith('actionEmailHistory', {
  //     ticketId: '123',
  //   });
  // });
});
