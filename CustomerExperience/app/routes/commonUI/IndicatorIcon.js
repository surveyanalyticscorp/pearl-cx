import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';

const IndicatorIcon = ({name, color, size = 12}) => {
  return (
    <IonIcons testID="indicator-icon" name={name} color={color} size={size} />
  );
};

export default IndicatorIcon;
