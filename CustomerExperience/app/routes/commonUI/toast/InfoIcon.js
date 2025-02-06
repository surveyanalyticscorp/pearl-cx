import React from 'react';
import {MarginConstants} from '../../../styles/margin.constants';
import Icon from './../../../../assets/images/Info.svg';

const InfoIcon = ({size = MarginConstants.tab1_3x}) => {
  return <Icon testID={'info-toast-icon'} width={size} height={size} />;
};

export default InfoIcon;
