import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MarginConstants} from '../../../../styles/margin.constants';
import {PaddingConstants} from '../../../../styles/padding.constants';

const EmailActionContainer = ({children}) => (
  <View style={styles.container}>{children}</View>
);

export default EmailActionContainer;

const styles = StyleSheet.create({
  container: {
    marginVertical: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    alignItems: 'center',
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});
