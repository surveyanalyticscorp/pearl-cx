import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';

export const CheckBox = ({isChecked, checkedColor, uncheckedColor}) => {
  return (
    <IonIcons
      testID="checkbox"
      name={isChecked ? 'checkbox' : 'square-outline'}
      size={24}
      color={
        isChecked
          ? checkedColor ?? Colors.accentLight
          : uncheckedColor ?? Colors.checkboxColor
      }
      style={{marginHorizontal: MarginConstants.halfTab}}
    />
  );
};
