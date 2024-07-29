import React from 'react';
import {Image} from 'react-native';

const PersonIcon = ({size = 24}) => {
  const icon = require('./../../../assets/images/person_icon.png');
  return <Image source={icon} style={{width: size, height: size}} />;
};

export default PersonIcon;
