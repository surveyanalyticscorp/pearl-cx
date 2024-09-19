import React from 'react';
import {render, fireEvent, waitFor} from '@testing-library/react-native';
import {useSelector} from 'react-redux';
import ActionEmailHistory from './ActionEmailHistory';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import {downloadFile} from '../../../Utils/DownloadUtils';
import {getDownloadPermissionAndroid} from '../../../Utils/PermissionUtils';
import RNFetchBlob from 'rn-fetch-blob';
import {Linking, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';

// Mock dependencies
jest.mock('react-redux', () => ({
  useSelector: jest.fn(),
}));

jest.mock('@react-navigation/native', () => ({
  useNavigation: jest.fn(),
}));

jest.mock('../../../Utils/TimeUtils', () => ({
  convertDateTimeAgo: jest.fn(),
}));

jest.mock('../../../Utils/DownloadUtils', () => ({
  downloadFile: jest.fn(),
}));

jest.mock('../../../Utils/PermissionUtils', () => ({
  getDownloadPermissionAndroid: jest.fn(),
}));

jest.mock('rn-fetch-blob', () => ({
  ios: {
    previewDocument: jest.fn(),
  },
}));

// jest.mock('react-native', () => {
//   const actualReactNative = jest.requireActual('react-native');

//   return {
//     ...actualReactNative,
//     Settings: {
//       get: jest.fn(),
//       set: jest.fn(),
//     },
//     NativeModules: {
//       ...actualReactNative.NativeModules,
//       SettingsManager: {
//         settings: {},
//       },
//     },
//   };
// });

describe('ActionEmailHistory', () => {
  const mockDetails = {
    data: [
      {
        createdAt: '2024-09-10T10:00:00Z',
        emailBody: '<p>Email body content</p>',
        emailSendBy: 'John Doe',
        attachments: [
          {
            path: 'https://example.com/file1.pdf',
            fileName: 'file1.pdf',
            mimeType: 'application/pdf',
          },
        ],
      },
    ],
  };

  const mockSummary = {
    data: {
      action: {
        subject: 'Test Subject',
      },
    },
  };

  beforeEach(() => {
    useSelector.mockImplementation(callback =>
      callback({
        dashboard: {
          ticketActionHistory: {
            details: mockDetails,
            summary: mockSummary,
          },
        },
      }),
    );
    convertDateTimeAgo.mockReturnValue('2 hours ago');
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly with data', () => {
    const {getByText} = render(<ActionEmailHistory />);

    expect(getByText('Test Subject')).toBeTruthy();
    expect(getByText('John Doe')).toBeTruthy();
    expect(getByText('2 hours ago')).toBeTruthy();
    expect(getByText('Attachments')).toBeTruthy();
    expect(getByText('file1.pdf')).toBeTruthy();
  });

  it('handles attachment download on press', async () => {
    Platform.OS = 'android'; // Set platform to Android for this test
    getDownloadPermissionAndroid.mockResolvedValue(true);
    downloadFile.mockResolvedValue({path: () => 'mock-path'});

    const {getByText} = render(<ActionEmailHistory />);
    const attachment = getByText('file1.pdf');

    fireEvent.press(attachment);

    await waitFor(() => {
      expect(getDownloadPermissionAndroid).toHaveBeenCalled();
      expect(downloadFile).toHaveBeenCalledWith(
        'https://example.com/file1.pdf',
        'file1.pdf',
      );
    });
  });

  // it('opens attachment in browser when pressed', async () => {
  //   const {getByTestId} = render(<ActionEmailHistory />);
  //   const attachment = getByTestId('attachment-button');

  //   fireEvent.press(attachment);

  //   expect(attachment).toHaveBeenCalled();
  // });

  it('displays a fallback message when no details are available', () => {
    useSelector.mockImplementation(callback =>
      callback({
        dashboard: {
          ticketActionHistory: {
            details: {},
            summary: {},
          },
        },
      }),
    );

    const {queryByText} = render(<ActionEmailHistory />);
    expect(queryByText('Test Subject')).toBeNull();
  });
});
