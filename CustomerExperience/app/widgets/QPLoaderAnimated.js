import React from 'react';
import {View, StyleSheet, Text, Image} from 'react-native';
import * as Animatable from 'react-native-animatable';

import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';

export default function QPLoaderAnimated(props) {
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
      <Animatable.View
        animation="rotate"
        iterationCount="infinite"
        duration={2000}
        easing="linear">
        <Image
          source={require('../../assets/images/qp_loader.gif')}
          style={{width: 100, height: 100}}
        />
      </Animatable.View>
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
