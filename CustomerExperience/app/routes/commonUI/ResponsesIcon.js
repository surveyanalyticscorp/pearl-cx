import React from 'react';
import {Image} from 'react-native';
import {Colors} from '../../styles/color.constants';

export const ResponsesIcon = ({
  size = 12,
  tintColor = Colors.filterIconColor,
}) => (
  <Image
    testID="image"
    source={require('./../../../assets/images/total_responses_icon.png')}
    style={{width: size, height: size, tintColor: tintColor}}
  />
);
