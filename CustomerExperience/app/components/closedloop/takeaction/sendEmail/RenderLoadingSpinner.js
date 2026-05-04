import React from 'react';
import {View, StyleSheet} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import QPLoader from '../../../../widgets/QPLoader';

const RenderLoadingSpinner = ({isLoading}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.loading}>
      <QPLoader spinnerText={'Generating....'} />
    </View>
  );
};

export default RenderLoadingSpinner;

const styles = StyleSheet.create({
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column',
    zIndex: 2,
    backgroundColor: Colors.white,
  },
});
