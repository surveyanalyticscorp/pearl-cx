import React from 'react';
import {Image} from 'react-native';

const StatusIcon = ({size = 24}) => {
  const icon = require('./../../../assets/images/responses_icon.png');
  return <Image source={icon} style={{width: size, height: size}} />;
};

export default StatusIcon;
