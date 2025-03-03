import React from 'react';
import {render} from '@testing-library/react-native';
import SendEmail from './SendEmail';
import {useDispatch, useSelector} from 'react-redux';

import {SafeAreaProvider} from 'react-native-safe-area-context';

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
      <SafeAreaProvider>
        <SendEmail
          route={{params: {ticketId: 123, toEmail: 'test@test.com'}}}
        />
      </SafeAreaProvider>,
    );

    expect(getByText('Respond Via Email')).toBeTruthy();
    expect(getByText('Action History')).toBeTruthy();
    expect(getByPlaceholderText('Email subject')).toBeTruthy();
    expect(getByText('Attachments')).toBeTruthy();
  });
});
