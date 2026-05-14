import {NativeModules} from 'react-native';

jest.mock('react-native', () => ({
  NativeModules: {
    RNDeviceInfo: {
      bundleId: 'com.questionpro.cxapp',
    },
  },
}));

describe('AppInfo', () => {
  let AppInfo;

  beforeAll(() => {
    AppInfo = require('./AppInfo').default;
  });

  it('should have the app version from DeviceInfo', () => {
    expect(AppInfo.appVersion).toBe('MockVersion');
  });

  it('should have the bundle id from NativeModules', () => {
    expect(AppInfo.appId).toBe('com.questionpro.cxapp');
  });

  it('should have the app name from DeviceInfo', () => {
    expect(AppInfo.appName).toBe('CX On The Go');
  });

  it('should have the device id from DeviceInfo', () => {
    expect(AppInfo.udid).toBe('MockDeviceId');
  });
});
