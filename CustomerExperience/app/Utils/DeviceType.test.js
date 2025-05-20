import getDeviceType from './DeviceType';

describe('getDeviceType', () => {
  it('should return 0 for android', () => {
    expect(getDeviceType('android')).toBe(0);
  });

  it('should return 1 for iOS', () => {
    expect(getDeviceType('ios')).toBe(1);
  });
  it('should return 2 for web', () => {
    expect(getDeviceType('web')).toBe(2);
  });
});
