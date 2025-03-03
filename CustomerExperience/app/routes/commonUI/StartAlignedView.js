// write a componenet view that aligns its children to the start

import React from 'react';
import {StyleSheet, View} from 'react-native';

const StartAlignedView = ({children}) => {
  return <View style={styles.container}>{children}</View>;
};

export default StartAlignedView;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
  },
});
