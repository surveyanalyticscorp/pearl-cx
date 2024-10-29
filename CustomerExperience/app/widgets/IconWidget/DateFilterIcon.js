import React from 'react';
import {Image} from 'react-native';

const DateFilterIcon = ({size = 24}) => {
  const icon = require('./../../../assets/images/date_filter_icon.png');
  return (
    <Image
      testID="date-filter-icon"
      source={icon}
      style={{width: size, height: size}}
    />
  );
};

export default DateFilterIcon;
