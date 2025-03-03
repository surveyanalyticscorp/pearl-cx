import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MarginConstants} from '../../../styles/margin.constants';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';

const NewResponseDot = ({style, isNewResponse = false}) => (
  <View
    testID="new-response-dot-container"
    style={{...styles.containerStyle, ...style}}>
    <View
      testID="new-response-dot-indicator"
      style={{
        ...styles.unreadIndicator,
        backgroundColor: isNewResponse
          ? Colors.accentLight
          : Colors.transparent,
      }}
    />
  </View>
);

const styles = StyleSheet.create({
  containerStyle: {},
  unreadIndicator: {
    height: 8,
    width: 8,
    borderRadius: 25,
  },
});

export default NewResponseDot;
