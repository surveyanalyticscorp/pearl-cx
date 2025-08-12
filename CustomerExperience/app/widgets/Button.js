import React from 'react';

import {buttonColors, textColors} from '../styles/color.constants';
import {Platform, StyleSheet, Text, Pressable, Dimensions} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
const screen = Dimensions.get('screen');
const QPButton = ({
  style = styles.button,
  textStyle = styles.text,
  onPress,
  buttonText,
  buttonColor,
  isDisabled = false,
  testID = 'QPButton',
}) => {
  const backgroundColor =
    buttonColor ?? style.backgroundColor ?? buttonColors.backgroundColor;
  const opacity = isDisabled ? 0.5 : 1;
  return (
    <Pressable
      disabled={isDisabled}
      testID={testID}
      style={[
        style,
        {
          backgroundColor: backgroundColor,
          opacity: opacity,
        },
      ]}
      onPress={isDisabled ? null : onPress}>
      <Text style={textStyle}>{buttonText}</Text>
    </Pressable>
  );
};
export default QPButton;

const styles = StyleSheet.create({
  button: {
    width: screen.width / 1.1,
    height: MarginConstants.tab3 * 1.5,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab4,
  },
  text: {
    alignSelf: 'center',
    color: textColors.primary,
    fontFamily: FontFamily.semiBold,
    fontSize: Platform.isPad ? TextSizes.primary : TextSizes.secondary,
  },
});
