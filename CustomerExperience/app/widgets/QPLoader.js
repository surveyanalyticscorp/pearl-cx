import React from 'react';
import {View, StyleSheet, Image, Text} from 'react-native';

import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';
import FastImage from 'react-native-fast-image';

export default function QPLoader({
  spinnerColor,
  indicatorCount,
  animationType,
  customSpinnerStyle,
  size,
  spinnerText,
}) {
  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <FastImage
        source={require('../../assets/images/qp_loader.gif')}
        style={{width: 100, height: 100}}
        resizeMode={FastImage.resizeMode.contain}
      />
      {!StringUtils.isEmpty(spinnerText) && (
        <Text style={styles.spinnerText}>{spinnerText}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  defaultButtonStyle: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#25CAC6',
  },
  defaultSpinnerContainerStyle: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  spinnerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
