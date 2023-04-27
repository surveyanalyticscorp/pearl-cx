import React from 'react';
import {
  Image,
  ImageBackground,
  Platform,
  StyleSheet,
  Text,
  Pressable,
  View,
} from 'react-native';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import Swiper from 'react-native-swiper';
import SafeAreaView from 'react-native-safe-area-view';
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily} from '../../styles/font.constants';

const stringConst = require('../../config/translations/en');

const MarketingScreen = props => {
  let content = getMarketingScreenContent();

  let introPages = [];
  for (let i = 0; i < content.length; i++) {
    introPages.push(
      <View key={i}>
        <IntroPage marketingComponent={content[i]} />
      </View>,
    );
  }

  const onPress = () => {
    props.navigation.navigate('Login');
  };

  return (
    <ImageBackground
      resizeMode={'cover'}
      source={require('../../config/images/background1.png')}
      style={styles.imageBackgroundContainer}>
      <SafeAreaView
        forceInset={{vertical: 'never'}}
        style={styles.safeAreaView}>
        <Swiper
          loop={false}
          showsButtons={false}
          dotColor={textColors.secondary}
          activeDotColor={Colors.accent}>
          {introPages}
        </Swiper>
        <Pressable style={styles.getStartedButton} onPress={onPress}>
          <Text style={styles.buttonTextColor}>
            {stringConst.onBoarding.getStarted}
          </Text>
        </Pressable>
      </SafeAreaView>
    </ImageBackground>
  );
};

function getMarketingScreenContent() {
  return [
    {
      introImage: require('../../config/images/ms_connect_engage.png'),
      introTitle: stringConst.onBoarding.marketing_title_1,
      description: stringConst.onBoarding.marketing_desc_1,
    },
    {
      introImage: require('../../config/images/ms_take_control.png'),
      introTitle: stringConst.onBoarding.marketing_title_2,
      description: stringConst.onBoarding.marketing_desc_2,
    },
    {
      introImage: require('../../config/images/ms_mobile_dashboard.png'),
      introTitle: stringConst.onBoarding.marketing_title_3,
      description: stringConst.onBoarding.marketing_desc_3,
    },
    {
      introImage: require('../../config/images/ms_drive_business_decisions.png'),
      introTitle: stringConst.onBoarding.marketing_title_4,
      description: stringConst.onBoarding.marketing_desc_4,
    },
    {
      introImage: require('../../config/images/ms_full_growth.png'),
      introTitle: stringConst.onBoarding.marketing_title_5,
      description: stringConst.onBoarding.marketing_desc_5,
    },
  ];
}

export default MarketingScreen;

function IntroPage(props) {
  const {marketingComponent} = props;
  return (
    <View style={styles.container}>
      <View style={styles.logoImageView}>
        <Image
          style={styles.logoImage}
          resizeMode="contain"
          source={marketingComponent.introImage}
        />
      </View>
      <View style={styles.introView}>
        <Text style={styles.introTextHeader}>
          {marketingComponent.introTitle}
        </Text>
        <Text style={styles.introText}>{marketingComponent.description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonTextColor: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  getStartedButton: {
    backgroundColor: Colors.accent,
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginBottom: MarginConstants.tab2,
  },
  container: {
    alignItems: 'center',
  },
  logoImage: {
    height: '100%',
    width: '100%',
    marginTop: 2 * MarginConstants.tab3,
  },
  introView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: MarginConstants.tab1,
    height: '50%',
  },
  logoImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '50%',
    width: '50%',
  },
  introTextHeader: {
    fontFamily: FontFamily.regular,
    fontSize: Platform.isPad ? TextSizes.extraLargeText : TextSizes.largeText,
    color: Colors.primary,
    textAlign: 'center',
    paddingHorizontal: MarginConstants.tab1,
  },
  introText: {
    color: Colors.secondary,
    textAlign: 'center',
    marginTop: MarginConstants.tab2,
    paddingHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.regular,
    fontSize: Platform.isPad ? TextSizes.largeText : TextSizes.primary,
  },
});
