import React from 'react';
import {View, StyleSheet} from 'react-native';

const SmileyImageLabel = props => {
  const {x, y, index, datum} = props;
  console.log('VICTORY_PIE', JSON.stringify(props));

  const style_ = StyleSheet.create({
    labelContainer: {
      width: 20,
      height: 20,
      position: 'absolute',
      left: x - 10,
      top: y - 10,
    },
    imageLabel: {
      width: 20,
      height: 20,

      justifyContent: 'center',
      alignItems: 'center',
    },
  });

  return datum.y === 0 ? (
    <View testID="no-view" />
  ) : (
    <View testID="label-container" style={style_.labelContainer}>
      <datum.SvgComponent
        testID="image-label"
        width={20}
        height={20}
        style={style_.imageLabel}
      />
    </View>
  );
};

export default SmileyImageLabel;
