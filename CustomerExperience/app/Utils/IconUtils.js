import React from 'react';
import {FontAwesomeIcon} from 'react-native-vector-icons/FontAwesome';
import {IonIcons} from 'react-native-vector-icons/Ionicons';
import {Colors} from '../styles/color.constants';

export const FaIcon = ({name, size, color, style}) => {
  return (
    <FontAwesomeIcon
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};

export const IonIcon = ({name, size, color, style}) => {
  return (
    <IonIcons
      name={name}
      size={size ?? 24}
      color={color ?? Colors.borderColor}
      style={style}
    />
  );
};
