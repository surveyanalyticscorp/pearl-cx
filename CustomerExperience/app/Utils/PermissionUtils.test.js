import {getDownloadPermissionAndroid} from './PermissionUtils';
import {PermissionsAndroid} from 'react-native';

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
}));

describe('getDownloadPermissionAndroid', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('should return true if permission is granted', async () => {
    PermissionsAndroid.request.mockResolvedValue(
      PermissionsAndroid.RESULTS.GRANTED,
    );

    const result = await getDownloadPermissionAndroid();

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    expect(result).toBe(true);
  });

  test('should return undefined if permission is denied', async () => {
    PermissionsAndroid.request.mockResolvedValue(
      PermissionsAndroid.RESULTS.DENIED,
    );

    const result = await getDownloadPermissionAndroid();

    expect(PermissionsAndroid.request).toHaveBeenCalledWith(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: 'File Download Permission',
        message: 'Your permission is required to save Files to your device',
        buttonNegative: 'Cancel',
        buttonPositive: 'OK',
      },
    );
    expect(result).toBeUndefined();
  });

  test('should log an error if an exception is thrown', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    PermissionsAndroid.request.mockRejectedValue(new Error('Test Error'));

    const result = await getDownloadPermissionAndroid();

    expect(consoleSpy).toHaveBeenCalledWith('err', new Error('Test Error'));
    expect(result).toBeUndefined();

    consoleSpy.mockRestore();
  });
});
