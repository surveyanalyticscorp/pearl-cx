import React from 'react';
import {Image, Pressable} from 'react-native';
import {Colors} from '../../styles/color.constants';

export const FilterIcon = ({
  onPressFilter,
  size,
  style,
  color,
  endComponent,
}) => {
  return (
    <Pressable
      testID="on-press-filter-icon"
      style={style}
      onPress={onPressFilter}>
      <Image
        source={require('./../../../assets/images/filter_icon.png')}
        style={{
          width: size ?? 22,
          height: size ?? 22,
          tintColor: color ?? Colors.filterIconColor,
        }}
      />
      {endComponent}
    </Pressable>
  );
};
