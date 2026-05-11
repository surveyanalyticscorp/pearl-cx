import React from 'react';
import {Colors} from '../../styles/color.constants';
import CalendarMonthSvg from '../../../assets/images/calendar_month.svg';

export const CalendarIcon = ({
  size = 12,
  tintColor = Colors.filterIconColor,
}) => (
  <CalendarMonthSvg
    testID="image-calendar"
    width={size}
    height={size}
    fill={tintColor}
  />
);
