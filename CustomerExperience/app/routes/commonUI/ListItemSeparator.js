import React from 'react';
import {View} from 'react-native';
import {Colors} from '../../styles/color.constants';

const ListItemSeparator = ({
  style,
  height = 0.5,
  backgroundColor = Colors.darkGrey,
}) => {
  return (
    <View
      style={{height: height, backgroundColor: backgroundColor, ...style}}
    />
  );
};

export default ListItemSeparator;
