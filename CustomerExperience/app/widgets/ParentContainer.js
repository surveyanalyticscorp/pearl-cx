import React from 'react';
import {StyleSheet, View} from 'react-native';
import {PaddingConstants} from '../styles/padding.constants';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';

export const ParentContainer = ({children, style}) => {
  return (
    <View
      testID="parent-container"
      style={{...styles.parentContainer, ...style}}>
      {children}
    </View>
  );
};

export const ChildContainer = ({children, style}) => {
  return (
    <View testID="child-container" style={{...styles.childContainer, ...style}}>
      {children}
    </View>
  );
};

const styles = StyleSheet.create({
  parentContainer: {
    padding: PaddingConstants.tab1,
    flex: 1,
  },
  childContainer: {
    padding: PaddingConstants.halfTab,
    marginVertical: MarginConstants.halfTab,
    flex: 1,
  },
});
