import React from 'react';
import {Pressable, Text} from 'react-native';

const IconButton = ({
  buttonStyle,
  textStyle,
  leftIcon,
  rightIcon,
  onPress,
  buttonText,
}) => {
  return (
    <Pressable style={buttonStyle} onPress={onPress}>
      {leftIcon}
      <Text style={textStyle}>{buttonText}</Text>
      {rightIcon}
    </Pressable>
  );
};

export default IconButton;
