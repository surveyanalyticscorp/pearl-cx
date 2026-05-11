import React from 'react';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {MarginConstants} from '../../styles/margin.constants';
import {getPriorityBorderColor} from '../../styles/color.constants';

export const RenderPriorityIcon = props => {
  return (
    <IonIcons
      style={{marginHorizontal: MarginConstants.halfTab}}
      name={'flag'}
      size={14}
      color={getPriorityBorderColor(props.title.toLowerCase())}
      testID="icon"
    />
  );
};
