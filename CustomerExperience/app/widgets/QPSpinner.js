import React from 'react';
import {View, StyleSheet, Text} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import { FontFamily } from '../styles/font.constants';
import { TextSizes } from '../styles/textsize.constants';
import { PaddingConstants } from '../styles/padding.constants';

export default function QPSpinner(props) {
  const {
    spinnerColor,
    indicatorCount,
    animationType,
    customSpinnerStyle,
    size,
    spinnerText
  } = props;

  return (
    <View style={{alignItems: 'center', justifyContent: 'center', flexDirection: 'column',}}>
      <Animatable.View
        testID="QPSpinner"
        useNativeDriver={true}
        animation={animationType || 'fadeIn'}
        style={[styles.defaultSpinnerContainerStyle, customSpinnerStyle]}>
        <DotIndicator
          color={spinnerColor || Colors.accent}
          count={indicatorCount || 3}
          size={size || 10}
        />
      </Animatable.View>
      {!StringUtils.isEmpty(spinnerText) && <Text style={styles.spinnerText}>{spinnerText}</Text>}
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
      fontSize: TextSizes.largeText,
      padding: PaddingConstants.tab1,
      color: Colors.accent,
    },
});
