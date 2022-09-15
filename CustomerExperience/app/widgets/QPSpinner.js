import React from 'react';
import {View, StyleSheet} from 'react-native';
import {DotIndicator} from 'react-native-indicators';
import * as Animatable from 'react-native-animatable';
import {Colors} from '../styles/color.constants';

export default function QPSpinner(props) {
  const {
    spinnerColor,
    indicatorCount,
    animationType,
    customSpinnerStyle,
    size,
  } = props;

  return (
    <View style={{alignItems: 'center', justifyContent: 'center'}}>
      <Animatable.View
        useNativeDriver={true}
        animation={animationType || 'fadeIn'}
        style={[styles.defaultSpinnerContainerStyle, customSpinnerStyle]}>
        <DotIndicator
          color={spinnerColor || Colors.accent}
          count={indicatorCount || 3}
          size={size || 10}
        />
      </Animatable.View>
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
});
