import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {FontFamily} from '../../../styles/font.constants';

export const IntroPage = ({image, introTitle, description}) => {
  return (
    <View testID="introPageContainer" style={styles.introPageContainer}>
      <View testID="introImage" style={styles.logoImageView}>
        {image}
      </View>
      <View style={styles.introView}>
        <Text testID="introTitle" style={styles.introTextHeader}>
          {introTitle}
        </Text>
        <Text testID="introDescription" style={styles.introText}>
          {description}
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  introPageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',

    marginBottom: MarginConstants.tab1_8x,
  },
  logoImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '80%',
  },
  introView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: MarginConstants.tab1_4x,
  },
  introTextHeader: {
    fontFamily: FontFamily.regular,
    fontSize:
      Platform.OS === 'ios'
        ? TextSizes.donutPercentText
        : TextSizes.extraLargeText,
    color: Colors.filterIconColor,
    textAlign: 'center',
  },
  introText: {
    color: Colors.filterIconColor,
    textAlign: 'center',
    marginTop: MarginConstants.tab1,
    fontFamily: FontFamily.regular,
    fontSize: Platform.OS === 'ios' ? TextSizes.largeText : TextSizes.primary,
  },
});
