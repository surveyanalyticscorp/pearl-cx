import React from 'react';
import {Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../styles/color.constants';

export const SortIcon = ({onPressFilter, size, style}) => {
  return (
    <Pressable style={style} testID="on-press-filter" onPress={onPressFilter}>
      <MaterialIcon name="sort" size={size ?? 24} color={Colors.lightBlack} />
    </Pressable>
  );
};
