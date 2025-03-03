import React from 'react';
import {Pressable, Text} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {baseTextStyles} from '../../styles/text.styles';

const IconButton = ({
  buttonStyle,
  textStyle,
  leftIcon,
  rightIcon,
  onPress,
  buttonText,
}) => {
  return (
    <Pressable
      testID="icon-button"
      style={buttonStyle ?? styles.buttonStyle}
      onPress={onPress}>
      {leftIcon}
      <Text style={textStyle ?? styles.textStyle}>{buttonText}</Text>
      {rightIcon}
    </Pressable>
  );
};

export default IconButton;

const styles = {
  buttonStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 2,
    backgroundColor: Colors.white,
  },
  textStyle: {
    ...baseTextStyles.secondaryRegularText,
  },
};
