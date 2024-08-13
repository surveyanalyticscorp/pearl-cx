import {Platform} from 'react-native';
import {$rem} from './globalStyleVariables';
const factor = Platform.isPad ? 0.8 : 1;
export const TextSizes = {
  donutPercentText: 2.2 * $rem * factor,
  extraLargeText: 1.8 * $rem * factor,
  largeText: 1.3 * $rem * factor,
  primary: 1.2 * $rem * factor,
  secondary: $rem * factor,
  semiSecondary2: 0.95 * $rem * factor,
  semiSecondary: 0.9 * $rem * factor,
  semiMediumText: 0.8 * $rem * factor,
  mediumText: 0.7 * $rem * factor,
  smallText: 0.6 * $rem * factor,
};
