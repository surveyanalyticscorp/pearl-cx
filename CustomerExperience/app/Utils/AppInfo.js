import {NativeModules} from 'react-native';
import DeviceInfo from 'react-native-device-info';

const AppInfo = {
  appVersion: DeviceInfo.getVersion(),
  appId: NativeModules.RNDeviceInfo?.bundleId,
  appName: DeviceInfo.getApplicationName(),
  udid: DeviceInfo.getDeviceId(),
};
export default AppInfo;
