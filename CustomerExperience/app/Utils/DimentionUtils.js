import React from 'react';
import {Dimensions} from 'react-native';

let {height, width} = Dimensions.get('window');

export const getHeightPercentage = viewHeight =>
  ((viewHeight / height) * 100).toFixed(2);
