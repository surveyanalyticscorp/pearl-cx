import React from 'react';
import {Text} from 'react-native';
import {baseTextStyles} from '../../styles/text.styles';
import {FontWeight} from '../../styles/font.constants';
import {Colors} from '../../styles/color.constants';

const TextLabel = ({text, fontWeight, color, baseTextStyle}) => {
  const fontWeight_ = fontWeight ?? FontWeight._500;
  const color_ = color ?? Colors.filterIconColor;
  const baseTextStyle_ = baseTextStyle ?? baseTextStyles.secondaryRegularText;
  return (
    <Text style={{...baseTextStyle_, fontWeight: fontWeight_, color: color_}}>
      {text}
    </Text>
  );
};

export default TextLabel;
