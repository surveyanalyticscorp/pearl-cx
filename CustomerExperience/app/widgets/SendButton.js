import React from 'react';
import {Colors} from '../styles/color.constants';
import {Image, Pressable} from 'react-native';

const SendButton = ({handleOnSubmit, size, color, style}) => {
  const size_ = size ?? 24;
  const color_ = color ?? Colors.filterIconColor;
  const iconFile = require('../../assets/images/send_icon.png');
  return (
    <Pressable style={style} onPress={handleOnSubmit}>
      <Image
        source={iconFile}
        style={{tintColor: color_, width: size_, height: size_}}
      />
    </Pressable>
  );
};

export default SendButton;
