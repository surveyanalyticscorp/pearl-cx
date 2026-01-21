import {Platform} from 'react-native';
import {$rem} from './globalStyleVariables';
const factor = Platform.isPad ? 0.8 : 1;
export const TextSizes = {
  donutPercentText: 2.2 * $rem * factor, // 30px~
  extraLargeText: 1.8 * $rem * factor, // 25px~
  largeText: 1.3 * $rem * factor, // 18px~
  primary: 1.2 * $rem * factor, // 16.8px~
  secondary2: 1.1 * $rem * factor, // 15.4px~
  secondary: $rem * factor, // 14px
  semiSecondary2: 0.95 * $rem * factor, // 13.3px~
  semiSecondary: 0.9 * $rem * factor, // 12.6px~
  semiMediumText: 0.8 * $rem * factor, // 11.2px~
  mediumText: 0.7 * $rem * factor, // 9.8px~
  smallText: 0.6 * $rem * factor, // 8.4px~
};
