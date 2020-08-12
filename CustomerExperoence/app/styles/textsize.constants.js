import {Dimensions, PixelRatio, Platform} from 'react-native';
var {height: screenHeight, width: screenWidth} = Dimensions.get('window');
const isTablet = () => {
  let pixelDensity = PixelRatio.get();
  const adjustedWidth = screenWidth * pixelDensity;
  const adjustedHeight = screenHeight * pixelDensity;
  if (pixelDensity < 2 && (adjustedWidth >= 1000 || adjustedHeight >= 1000)) {
    return true;
  } else {
    return (
      pixelDensity === 2 && (adjustedWidth >= 1920 || adjustedHeight >= 1920)
    );
  }
};

const factor = isTablet() ? 0.8 : 1;
const rem = Platform.OS === 'ios' ? 15 : 14;
export const TextSizes = {
  donutPercentText: 2.2 * rem * factor,
  extraLargeText: 1.8 * rem * factor,
  largeText: 1.4 * rem * factor,
  primary: 1.2 * rem * factor,
  secondary: rem * factor,
  semiMediumText: 0.8 * rem * factor,
  mediumText: 0.7 * rem * factor,
  smallText: 0.6 * rem * factor,
};
