// write a componenet view that aligns its children to the end
import React from 'react';
import {StyleSheet, View} from 'react-native';

const EndAlignedView = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default EndAlignedView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
});
