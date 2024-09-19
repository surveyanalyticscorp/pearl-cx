export const DeviceInfo = {
  isTablet: jest.fn(() => false),
  hasNotch: jest.fn(() => false),
  hasDynamicIsland: jest.fn(() => false),
  getModel: jest.fn(() => 'MockModel'),
  getSystemName: jest.fn(() => 'MockSystemName'),
  getSystemVersion: jest.fn(() => 'MockSystemVersion'),
  getVersion: jest.fn(() => 'MockVersion'),
  getIPAddress: () => {},
};

export default DeviceInfo;
