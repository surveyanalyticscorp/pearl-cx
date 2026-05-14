import {getDownloadPermissionAndroid} from './PermissionUtils';
import {PermissionsAndroid, Platform} from 'react-native';

jest.mock('react-native', () => ({
  PermissionsAndroid: {
    request: jest.fn(),
    PERMISSIONS: {
      WRITE_EXTERNAL_STORAGE: 'WRITE_EXTERNAL_STORAGE',
    },
    RESULTS: {
      GRANTED: 'granted',
      DENIED: 'denied',
    },
  },
  Platform: {
    OS: 'android',
    Version: 25,
  },
}));

describe('getDownloadPermissionAndroid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    Platform.OS = 'android';
    Platform.Version = 25;
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE =
      'WRITE_EXTERNAL_STORAGE';
  });

  test('should return true for non-android platforms', async () => {
    Platform.OS = 'ios';
    const result = await getDownloadPermissionAndroid();
    expect(result).toBe(true);
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
  });

  test('should return true on Android API 30+', async () => {
    Platform.OS = 'android';
    Platform.Version = 30;
    const result = await getDownloadPermissionAndroid();
    expect(result).toBe(true);
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
  });

  test('should return false when WRITE_EXTERNAL_STORAGE permission is unavailable', async () => {
    Platform.OS = 'android';
    Platform.Version = 25;
    PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE = undefined;
    const result = await getDownloadPermissionAndroid();
    expect(result).toBe(false);
    expect(PermissionsAndroid.request).not.toHaveBeenCalled();
  });

  test('should return true if permission is granted', async () => {
    PermissionsAndroid.request.mockResolvedValue(
      PermissionsAndroid.RESULTS.GRANTED,
    );
    const result = await getDownloadPermissionAndroid();
    expect(result).toBe(true);
    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      'WRITE_EXTERNAL_STORAGE',
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
  });

  test('should return false if permission is denied', async () => {
    PermissionsAndroid.request.mockResolvedValue(
      PermissionsAndroid.RESULTS.DENIED,
    );
    const result = await getDownloadPermissionAndroid();
    expect(result).toBe(false);
  });

  test('should return false and log error if an exception is thrown', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    PermissionsAndroid.request.mockRejectedValue(new Error('Test Error'));
    const result = await getDownloadPermissionAndroid();
    expect(consoleSpy).toHaveBeenCalledWith('err', new Error('Test Error'));
    expect(result).toBe(false);
    consoleSpy.mockRestore();
  });
});
