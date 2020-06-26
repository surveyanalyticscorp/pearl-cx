
import { Dimensions, Platform, PixelRatio } from 'react-native';

const { width, height } = Dimensions.get('window');

function getSize() {
    let size = 12;
    if (PixelRatio.get() === 2) {
         if (width >= 375) {
            size = 13;
         }
    } else if (PixelRatio.get() === 3) {
        size = 15;
    } else if (PixelRatio.get() === 3.5) {
        size = 17;
    }

    return size;
}

export function responsiveFontSize() {
    const size = getSize();
   
  if (Platform.OS === 'ios') {
    return Math.round(PixelRatio.roundToNearestPixel(size));
  } else {
    return Math.round(PixelRatio.roundToNearestPixel(size)) - 2;
  }
}
