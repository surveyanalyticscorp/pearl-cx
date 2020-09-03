import React from 'react';
import {Dimensions, PixelRatio,Platform} from 'react-native';
import Orientation from 'react-native-orientation-locker';

const {height, width, scale, fontScale} = Dimensions.get('window');

let rem = Platform.OS === 'ios' ? 15: 14;
const initial = Orientation.getInitialOrientation();
let tempWidth = width;

if (initial === 'PORTRAIT' || initial === 'PORTRAITUPSIDEDOWN') {
    tempWidth = width
} else if (initial === 'LANDSCAPE') {
    tempWidth = height
} else {
    tempWidth = width > height ? height : width
}

tempWidth = tempWidth / PixelRatio.get();

if (tempWidth >= 768) {
    /**
     * when pixel ratio is 1
     * */
    rem = tempWidth === 768 ? 18:20;
} else if (tempWidth > 414) {
    rem = 26;
} else if (tempWidth > 385) {
    rem = 18;
} else if (tempWidth >= 300) {
    rem = 15;
}

export const $rem = rem;
