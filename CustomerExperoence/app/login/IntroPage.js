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
    width: '100%',
    fontSize: TextSizes.extraLargeText,
    color: textColors.primary,
    textAlign: 'center',
    paddingHorizontal: MarginConstants.tab1,
    //fontFamily: FontFamily.Light,
  },
  introText: {
    width: '100%',
    color: textColors.primary,
    textAlign: 'center',
    marginTop: MarginConstants.tab3,
    paddingHorizontal: MarginConstants.tab3,
    fontSize: Platform.isPad ? TextSizes.largeText : TextSizes.primary,
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
