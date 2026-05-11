import React from 'react';
import {View} from 'react-native';
import {
  Colors,
  getStatusBorderColor,
  getStatusFillerColor,
} from '../../../styles/color.constants';
import {ResponsesIcon} from '../ResponsesIcon';

export const RenderStatusIcon = ({size, title, style}) => {
  const statusStyle = {
    ...style,
    borderRadius: 50,
    borderWidth: 1,
    borderColor: getStatusBorderColor(title.toLowerCase()),
    backgroundColor: getStatusFillerColor(title.toLowerCase()),
    height: size ?? 14,
    width: size ?? 14,
  };

  if (title.toLowerCase() === 'all') {
    return <ResponsesIcon size={14} tintColor={Colors.accentLight} />;
  }
  return <View testID="render-status-icon" style={statusStyle} />;
};
