import React from 'react';
import {Pressable} from 'react-native';
import {IonIcon} from '../../../Utils/IconUtils';
import {MarginConstants} from '../../../styles/margin.constants';

const LeadingIcon = ({name, testID, color}) => {
  return (
    <IonIcon
      testID={testID}
      name={name}
      size={MarginConstants.tab1_4x}
      color={color}
    />
  );
};

export default LeadingIcon;
