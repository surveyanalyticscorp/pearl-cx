export const DeviceInfo = {
  isTablet: jest.fn(() => false),
  hasNotch: jest.fn(() => false),
  hasDynamicIsland: jest.fn(() => false),
  getModel: jest.fn(() => 'MockModel'),
  getSystemName: jest.fn(() => 'MockSystemName'),
  getSystemVersion: jest.fn(() => 'MockSystemVersion'),
  getVersion: jest.fn(() => 'MockVersion'),
  getIPAddress: () => {},
  getApplicationName: jest.fn(() => 'CX On The Go'),
  getDeviceId: jest.fn(() => 'MockDeviceId'),
};

export default DeviceInfo;
