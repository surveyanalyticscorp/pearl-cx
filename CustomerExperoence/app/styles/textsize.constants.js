import DeviceInfo from 'react-native-device-info';
import {Dimensions, PixelRatio, Platform} from 'react-native';

const factor = DeviceInfo.isTablet() ? 0.8 : 1;
const rem = Platform.OS === 'ios' ? 15 : 14;
export const TextSizes = {
  extraLargeText: 1.8 * rem * factor,
  largeText: 1.4 * rem * factor,
  primary: 1.2 * rem * factor,
  secondary: rem * factor,
  mediumText: 0.7 * rem * factor,
  smallText: 0.6 * rem * factor,
};
