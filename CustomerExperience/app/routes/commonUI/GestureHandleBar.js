import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';

const GestureHandleBar = () => {
  const handlerStyle = StyleSheet.create({
    container: {
      alignItems: 'center',
    },
    handler: {
      height: MarginConstants.halfTab,
      width: '33%',
      backgroundColor: Colors.darkGrey,
    },
  });
  return (
    <View testID="gesture-handle-bar" style={handlerStyle.container}>
      <View style={handlerStyle.handler} />
    </View>
  );
};

export default GestureHandleBar;
