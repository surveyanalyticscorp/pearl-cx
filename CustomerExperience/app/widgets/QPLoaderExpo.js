import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {Video} from 'expo-av';

import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';

export default function QPLoaderExpo(props) {
  const {
    spinnerColor,
    indicatorCount,
    animationType,
    customSpinnerStyle,
    size,
    spinnerText,
  } = props;

  return (
    <View
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
      }}>
      <Video
        source={require('../../assets/images/qp_loader.gif')}
        style={{width: 100, height: 100}}
        shouldPlay
        isLooping
        isMuted
        resizeMode="contain"
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
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.semiSecondary,
    padding: PaddingConstants.tab1,
    color: Colors.accent,
  },
});
