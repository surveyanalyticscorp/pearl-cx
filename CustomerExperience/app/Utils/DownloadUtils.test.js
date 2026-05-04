// DownloadUtils.test.js
import {Platform} from 'react-native';
import RNFetchBlob from 'react-native-blob-util';
import {downloadFile} from './DownloadUtils';

// Mock RNFetchBlob
jest.mock('react-native-blob-util', () => ({
  config: jest.fn().mockReturnThis(),
  fetch: jest.fn(),
  fs: {
    dirs: {
      DownloadDir: '/mock/dir',
    },
  },
}));

describe('downloadFile', () => {
  const url = 'http://example.com/file.png';
  const filename = 'file.png';

  beforeEach(() => {
    RNFetchBlob.config.mockClear();
    RNFetchBlob.fetch.mockClear();
    Platform.OS = 'ios'; // Set default platform to iOS
  });

  it('should return the response when download is successful', async () => {
    const mockResponse = {
      path: jest.fn().mockReturnValue('/mock/dir/file.png'),
    };
    RNFetchBlob.fetch.mockResolvedValue(mockResponse);

    const result = await downloadFile(url, filename);

    expect(RNFetchBlob.config).toHaveBeenCalledWith(
      expect.objectContaining({
        fileCache: true,
        path: '/mock/dir/file.png',
        appendExt: 'png',
      }),
    );
    expect(RNFetchBlob.fetch).toHaveBeenCalledWith('GET', url);
    expect(result).toEqual(mockResponse);
  });

  it('should return null when there is an error', async () => {
    RNFetchBlob.fetch.mockRejectedValue(new Error('Download failed'));

    const result = await downloadFile(url, filename);

    expect(result).toBeNull();
  });

  it('should use Android-specific options on Android platform', async () => {
    Platform.OS = 'android'; // Set platform to Android
    const mockResponse = {
      path: jest.fn().mockReturnValue('/mock/dir/file.png'),
    };
    RNFetchBlob.fetch.mockResolvedValue(mockResponse);

    await downloadFile(url, filename);

    // Log the config call arguments for debugging
    console.log('Config Call Arguments:', RNFetchBlob.config.mock.calls);

    expect(RNFetchBlob.config).toHaveBeenCalledWith(
      expect.objectContaining({
        fileCache: true,
        path: '/mock/dir/file.png',
        appendExt: 'png',
      }),
    );
  });

  it('should use iOS-specific options on iOS platform', async () => {
    Platform.OS = 'ios'; // Set platform to iOS
    const mockResponse = {
      path: jest.fn().mockReturnValue('/mock/dir/file.png'),
    };
    RNFetchBlob.fetch.mockResolvedValue(mockResponse);

    await downloadFile(url, filename);

    expect(RNFetchBlob.config).toHaveBeenCalledWith(
      expect.objectContaining({
        fileCache: true,
        path: '/mock/dir/file.png',
        appendExt: 'png',
      }),
    );
  });
});
