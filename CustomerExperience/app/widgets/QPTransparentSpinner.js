import React from 'react';
import {View, StyleSheet, Text, Animated} from 'react-native';
import AnimatedDotIndicator from './AnimatedDotIndicator';
import {Colors} from '../styles/color.constants';
import StringUtils from '../Utils/StringUtils';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {MarginConstants} from '../styles/margin.constants';

export const QPTransparentSpinner = ({
  containerStyle,
  textStyle,
  subText,
  idicatorColor,
  animationType,
}) => {
  return (
    <Animated.View
      useNativeDriver={true}
      animation={animationType || 'fadeIn'}
      style={{...styles.container, ...containerStyle}}>
      <View style={styles.indicatorContainer}>
        <AnimatedDotIndicator
          color={idicatorColor ?? Colors.white}
          count={3}
          size={10}
          animationDuration={600}
        />
      </View>
      {!StringUtils.isEmpty(subText) && (
        <Text style={{...styles.spinnerText, ...textStyle}}>{subText}</Text>
      )}
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.45)',
    zIndex: 10,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  },
  indicatorContainer: {
    height: MarginConstants.tab1_4x,
    justifyContent: 'center',
  },
  spinnerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.semiSecondary2,
    padding: PaddingConstants.tab1,
    color: Colors.white,
  },
});
