import React from 'react';

import {
  buttonColors,
  textColors,
  disabledButtonColors,
} from '../styles/color.constants';
import {Platform, StyleSheet, Text, Pressable, Dimensions} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
const screen = Dimensions.get('screen');
const QPButton = ({
  style = styles.button,
  textStyle,
  onPress,
  buttonText,
  buttonColor,
  isDisabled = false,
  testID = 'QPButton',
}) => {
  const backgroundColor =
    buttonColor ?? style.backgroundColor ?? buttonColors.backgroundColor;
  const textStyle_ = isDisabled
    ? styles.disabledButtonText
    : textStyle ?? styles.text;
  return (
    <Pressable
      disabled={isDisabled}
      testID={testID}
      style={[
        style,
        {
          backgroundColor: isDisabled
            ? disabledButtonColors.buttonColor
            : backgroundColor,
        },
      ]}
      onPress={isDisabled ? null : onPress}>
      <Text style={textStyle_}>{buttonText}</Text>
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
  disabledButtonText: {
    alignSelf: 'center',
    color: disabledButtonColors.textColor,
    fontFamily: FontFamily.regular,
    fontSize: Platform.isPad ? TextSizes.primary : TextSizes.secondary,
  },
});
