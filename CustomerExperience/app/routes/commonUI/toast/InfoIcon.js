import React from 'react';
import {MarginConstants} from '../../../styles/margin.constants';
import InfoSvg from './../../../../assets/images/info.svg';

const InfoIcon = ({size = MarginConstants.tab1_3x, tintColor}) => {
  return (
    <InfoSvg
      testID={'info-toast-icon'}
      width={size}
      height={size}
      fill={tintColor}
      color={tintColor}
    />
  );
};

export default InfoIcon;
