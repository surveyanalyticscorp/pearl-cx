import React from 'react';

import {
  View,
  Image,
  ScrollView,
  Platform,
  Text,
  StyleSheet,
} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';
import {textColors} from '../styles/color.constants';
import {fontFamily} from '../styles/font.constants';
export default function IntroPage(props) {
  const {marketingComponent} = props;
  return (
    <ScrollView contentContainerStyle={styles.scrollView}>
      <View style={styles.logoImageView}>
        {marketingComponent.isLogoRequired && (
          <Image
            style={styles.logoImage}
            resizeMode="contain"
            source={marketingComponent.introImage}
          />
        )}
      </View>
      <View style={styles.introView}>
        <Text style={styles.introTextHeader}>
          {marketingComponent.introTitle}
        </Text>
        <Text style={styles.introText}>{marketingComponent.description}</Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flexGrow: 1,
  },
  scrollView: {
    flexGrow: 1,
    height: '100%',
  },
  introView: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '50%',
  },
  introTextHeader: {
    fontFamily: fontFamily.Bold,
    width: '100%',
    fontSize: Platform.isPad ? TextSizes.extraLargeText : TextSizes.largeText,
    color: textColors.primary,
    textAlign: 'center',
    paddingHorizontal: MarginConstants.tab1,
  },
  introText: {
    width: '100%',
    color: textColors.primary,
    textAlign: 'center',
    marginTop: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab3,
    fontFamily: fontFamily.Light,
    fontSize: Platform.isPad ? TextSizes.primary : TextSizes.secondary,
    //fontFamily: FontFamily.Light,
  },

  logoImageView: {
    width: '100%',
    height: '50%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoImage: {
    alignSelf: 'center',
    height: '60%',
    width: '60%',
  },
});
