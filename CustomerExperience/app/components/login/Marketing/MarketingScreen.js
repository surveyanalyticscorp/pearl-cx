import React from 'react';
import {Platform, StyleSheet, Text, Pressable, View} from 'react-native';
import {Colors, textColors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Swiper from 'react-native-swiper';
import SafeAreaView from 'react-native-safe-area-view';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {StackActions} from '@react-navigation/native';
import {translate} from '../../../Utils/MultilinguaUtils';
import {IntroPage} from './IntroPage';
import {getMarketingScreenContent} from './marketingContent';
import {get} from 'lodash';

export const MarketingScreen = ({navigation}) => {
  const handleGetStarted = () => {
    const pushAction = StackActions.push('Login');
    navigation.dispatch(pushAction);
  };

  const renderIntroPages = () => {
    return getMarketingScreenContent().map((content, index) => (
      <View key={index}>
        <IntroPage {...content} />
      </View>
    ));
  };

  return (
    <SafeAreaView
      forceInset={{vertical: 'never'}}
      style={styles.safeAreaView}
      testID="marketing-screen">
      <Swiper
        loop={false}
        showsButtons={false}
        dotColor={textColors.secondary}
        activeDotColor={Colors.accentLight}
        testID="marketing-swiper">
        {renderIntroPages()}
      </Swiper>
      <Pressable
        testID="get-started-button"
        style={styles.getStartedButton}
        onPress={handleGetStarted}>
        <Text style={styles.buttonTextColor}>
          {translate('onBoarding.signIn')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingBottom:
      Platform.OS === 'ios' ? PaddingConstants.tab2 : PaddingConstants.tab1,
  },
  buttonTextColor: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  getStartedButton: {
    backgroundColor: Colors.accentLight,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: PaddingConstants.tab1_2x,
    marginBottom: MarginConstants.tab1_4x,
    borderRadius: MarginConstants.halfTab,
    marginHorizontal: MarginConstants.tab1_4x,
  },
});

export default MarketingScreen;
