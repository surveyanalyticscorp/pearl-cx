import React from 'react';
import {View} from 'react-native';
import QPButton from '../../../widgets/Button';
import {Colors} from '../../../styles/color.constants';
import {StyleSheet} from 'react-native';
import {FontFamily, FontWeight} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';

export const RootCauseNavigationButtons = () => {
  return (
    <View style={styles.buttonView}>
      <QPButton
        onPress={() => {
          console.log('Centralized');
        }}
        textStyle={{
          ...styles.buttonText,
          ...styles.centralizedButtonTextColor,
        }}
        style={{...styles.buttonStyle, ...styles.centralizedButtonColor}}
        buttonText="Centralized"
      />
      <QPButton
        textStyle={{
          ...styles.buttonText,
          ...styles.olodRootCauseButtonTextColor,
        }}
        style={{...styles.buttonStyle, ...styles.oldRootCauseButtonColor}}
        buttonText="Previous root cause"
        onPress={() => {
          console.log('Previous root cause');
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.secondary,
  },
  buttonView: {
    margin: MarginConstants.tab1,
    flexDirection: 'row',
  },

  centralizedButtonTextColor: {
    color: Colors.white,
  },
  olodRootCauseButtonTextColor: {
    color: Colors.filterIconColor,
  },

  buttonStyle: {
    alignItems: 'center',
    margin: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1,
    borderRadius: 5,
    maxWidth: '50%',
  },

  centralizedButtonColor: {
    backgroundColor: Colors.accentLight,
  },
  oldRootCauseButtonColor: {
    backgroundColor: Colors.negativePromter,
  },
});
