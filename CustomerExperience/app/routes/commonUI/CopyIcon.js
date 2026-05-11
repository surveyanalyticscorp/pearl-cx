import React from 'react';
import {Image} from 'react-native';
import {Colors} from '../../styles/color.constants';

export const CopyIcon = ({size = 12, tintColor = Colors.filterIconColor}) => (
  <Image
    source={require('./../../../assets/images/copy_icon.png')}
    style={{width: size, height: size, tintColor: tintColor}}
    testID={'image'}
  />
);
