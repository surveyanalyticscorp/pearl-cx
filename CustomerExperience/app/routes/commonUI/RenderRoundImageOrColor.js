import React from 'react';
import {Image, StyleSheet, View} from 'react-native';
import {Colors} from '../../styles/color.constants';

export const RenderRoundImageOrColor = ({data, size}) => {
  const _size = size ?? 20;

  const viewStyles = StyleSheet.create({
    color: {
      height: _size,
      width: _size,
      borderRadius: 50,
      alignSelf: 'center',
      borderColor:
        data && data.borderColor ? data.borderColor : Colors.transparent,
      backgroundColor: data && data.color ? data.color : Colors.transparent,
    },
    image: {
      height: _size,
      width: _size,
      borderRadius: 50,
      alignSelf: 'center',
    },
  });

  return data && data.hasOwnProperty('color') ? (
    <View testID="round-color" style={viewStyles.color} />
  ) : (
    <Image
      testID="round-image"
      source={{
        uri: data.url,
      }}
      style={viewStyles.image}
    />
  );
};
