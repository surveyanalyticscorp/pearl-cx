import React from 'react';
import {Colors} from '../styles/color.constants';
import {Image, Pressable} from 'react-native';

const SendButton = ({handleOnSubmit, size, color, style}) => {
  const size_ = size ?? 24;
  const color_ = color ?? Colors.filterIconColor;
  const iconFile = require('../../assets/images/send_icon.png');
  const style_ = style ?? {margin: 0, padding: 0};
  return (
    <Pressable style={style_} onPress={handleOnSubmit}>
      <Image
        source={iconFile}
        style={{
          tintColor: color_,
          width: size_,
          height: size_,
        }}
      />
    </Pressable>
  );
};

export default SendButton;
