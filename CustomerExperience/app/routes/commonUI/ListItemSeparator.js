import React from 'react';
import {View} from 'react-native';
import {Colors} from '../../styles/color.constants';

const ListItemSeparator = ({style}) => {
  return (
    <View style={{...style, height: 0.5, backgroundColor: Colors.darkGrey}} />
  );
};

export default ListItemSeparator;
