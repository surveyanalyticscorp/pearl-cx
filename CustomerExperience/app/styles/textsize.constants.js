import DeviceInfo from "react-native-device-info";
import {$rem} from './globalStyleVariables';
const factor = DeviceInfo.isTablet() ? 0.8 : 1;
export const TextSizes={
  donutPercentText: 2.2 * $rem * factor,
  extraLargeText: 1.8 * $rem * factor,
  largeText: 1.4 * $rem * factor,
  primary: 1.2 * $rem * factor,
  secondary:  $rem * factor,
  semiSecondary:  0.9 * $rem * factor,
  semiMediumText: 0.8 * $rem * factor,
  mediumText: 0.7 * $rem * factor,
  smallText: .6 * $rem * factor
};
