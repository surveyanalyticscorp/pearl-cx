import React from 'react';
import {Image} from 'react-native';
const ResetFilterIcon = ({size = 12}) => {
  const icon = require('./../../../assets/images/reset_icon.png');

  return (
    <Image
      testID="person-icon"
      source={icon}
      style={{width: size, height: size}}
    />
  );
};

export default ResetFilterIcon;
