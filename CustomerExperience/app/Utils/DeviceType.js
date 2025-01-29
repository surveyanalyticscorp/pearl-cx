const DEVICE_TYPE = {
  android: 0,
  ios: 1,
  web: 2,
};

export default function getDeviceType(deviceType) {
  return DEVICE_TYPE[deviceType];
}
