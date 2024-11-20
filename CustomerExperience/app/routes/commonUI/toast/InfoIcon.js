import React from 'react';
import {Image} from 'react-native';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const InfoIcon = ({size = MarginConstants.tab1_3x}) => {
  const icon = require('../../../../assets/images/info_icon.png');
  return (
    <Image
      testID="person-icon"
      source={icon}
      style={{
        paddingVertical: PaddingConstants.halfTab,
        width: size,
        height: size,
      }}
    />
  );
};

export default InfoIcon;
