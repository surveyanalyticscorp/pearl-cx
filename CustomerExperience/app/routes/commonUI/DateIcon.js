import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';

export const DateIcon = () => {
  return (
    <IonIcons
      testID="icon-calendar"
      style={{margin: MarginConstants.halfTab}}
      name="calendar"
      size={20}
      color={Colors.lightBlack}
    />
  );
};
