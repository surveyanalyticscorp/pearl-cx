import React from 'react';
import {View} from 'react-native';

export const StatusIcon = ({
  size,
  borderRadius,
  borderWidth,
  borderColor,
  fillerColor,
}) => {
  const size_ = size ?? 20;
  const radius_ = borderRadius ?? 50;
  const borderWidth_ = borderWidth ?? 1;
  return (
    <View
      style={{
        width: size_,
        height: size_,
        borderRadius: radius_,
        borderColor: borderColor,
        borderWidth: borderWidth_,
        backgroundColor: fillerColor,
      }}
      testID={'status-icon'}
    />
  );
};
