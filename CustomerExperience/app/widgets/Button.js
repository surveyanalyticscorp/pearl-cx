import React from 'react';

import {buttonColors, textColors} from '../styles/color.constants';
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';
import {FontFamily} from '../styles/font.constants';
const screen = Dimensions.get('screen');
const QPButton = (props) => {
  let style = props.style ? props.style : styles.button;
  let textStyle = props.textStyle ? props.textStyle : styles.text;

  const onPress = () => {
    props.onPress && props.onPress();
  };

  return (
    <TouchableOpacity
      style={[
        style,
        {backgroundColor: props.buttonColor ?? buttonColors.backgroundColor},
      ]}
      onPress={onPress}>
      <Text style={textStyle}>{props.buttonText}</Text>
    </TouchableOpacity>
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
