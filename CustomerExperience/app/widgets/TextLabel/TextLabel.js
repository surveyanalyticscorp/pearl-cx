import React from 'react';
import {Platform, Text} from 'react-native';
import {baseTextStyles} from '../../styles/text.styles';
import {FontWeight} from '../../styles/font.constants';
import {Colors} from '../../styles/color.constants';

const TextLabel = ({
  numberOfLines,
  text,
  fontWeight,
  color,
  baseTextStyle,
  style,
  children,
}) => {
  const fontWeight_ =
    fontWeight ?? Platform.OS === 'ios' ? FontWeight._400 : FontWeight._500;
  const color_ = color ?? Colors.filterIconColor;
  const baseTextStyle_ = baseTextStyle ?? baseTextStyles.secondaryRegularText;
  return (
    <Text
      numberOfLines={numberOfLines}
      style={{
        ...style,
        ...baseTextStyle_,
        fontWeight: fontWeight_,
        color: color_,
      }}>
      {text || children}
    </Text>
  );
};

export default TextLabel;
