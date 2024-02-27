import React from 'react';
import {Image} from 'react-native';

const CaretDownIcon = ({height = 8, width = 12}) => {
  const caretDownIcon = require('./../../../assets/images/caret_down.png');

  return (
    <Image source={caretDownIcon} style={{height: height, width: width}} />
  );
};

export default CaretDownIcon;
