import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';

export const RadioButtonCheckbox = ({
  isChecked = false,
  checkedColor = Colors.accentLight,
  uncheckedColor = Colors.checkboxColor,
  size,
  style,
}) => {
  return (
    <IonIcons
      testID="radio-button-checkbox"
      name={isChecked ? 'radio-button-on' : 'radio-button-off'}
      size={size ?? 24}
      color={isChecked ? checkedColor : uncheckedColor}
      isChecked={isChecked}
      style={{marginHorizontal: MarginConstants.halfTab, ...style}}
    />
  );
};
