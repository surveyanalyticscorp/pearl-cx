import React from 'react';
import {Pressable} from 'react-native';
import {IonIcon} from '../../../Utils/IconUtils';
import {MarginConstants} from '../../../styles/margin.constants';

const TrailingIcon = ({onPress, testID, color}) => {
  return (
    <Pressable onPress={onPress}>
      <IonIcon
        testID={testID}
        name="close-outline"
        size={MarginConstants.tab1_4x}
        color={color}
      />
    </Pressable>
  );
};

export default TrailingIcon;
