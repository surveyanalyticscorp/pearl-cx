import React from 'react';
import {ImageBackground, StyleSheet, Image, Platform} from 'react-native';
import {TouchableOpacity, View, Text} from 'react-native';
import {Colors, textColors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import Swiper from 'react-native-swiper';
import SafeAreaView from "react-native-safe-area-view";
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily} from '../../styles/font.constants';

const stringConst = require('../../config/locales/en');

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
        <SafeAreaView forceInset={{vertical: 'never'}} style={styles.safeAreaView}>
        <Swiper
          loop={false}
          showsButtons={false}
          dotColor={textColors.secondary}
          activeDotColor={Colors.secondaryAccent}
          >
          {introPages}
        </Swiper>
        <TouchableOpacity style={styles.getStartedButton} onPress={onPress}>
          <Text style={styles.buttonTextColor}>{stringConst.getStarted}</Text>
        </TouchableOpacity>
        </SafeAreaView>
      </ImageBackground>
  );
};

function getMarketingScreenContent() {
  return [
    {
      introImage: require('../../config/images/ms_connect_engage.png'),
      introTitle: 'Connect and engage with your customers. Anytime, anywhere',
      description:
        'Communicate with customers or prospects through a wide selection of feedback channels at every touchpoint anywhere, no matter the device.',
    },
    {
      introImage: require('../../config/images/ms_take_control.png'),
      introTitle: 'Take full control of your customer’s journey',
      description:
        'Analyze your customer’s 360 experience and quickly identify actionable insights and trends.',
    },
    {
      introImage: require('../../config/images/ms_mobile_dashboard.png'),
      introTitle: 'Manage real-time analytics in one dashboard',
      description:
        'Easily monitor your business with the role-based, customizable dashboard from anywhere.',
    },
    {
      introImage: require('../../config/images/ms_drive_business_decisions.png'),
      introTitle: 'Make immediate business decisions',
      description:
        'Prioritize actions quickly based on customer data to excel their expectations with our closed-loop feedback system with real-time alerts.',
    },
    {
      introImage: require('../../config/images/ms_full_growth.png'),
      introTitle: 'Fuel growth organically',
      description:
        'Identify your best customers and help them become your brand ambassadors through social referrals with our unique Promoter Amplification system.',
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
          <Text style={styles.introTextHeader}>{marketingComponent.introTitle}</Text>
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
    fontSize: TextSizes.primary,
    textAlign: 'center',
  },
  getStartedButton: {
    backgroundColor: Colors.secondaryAccent,
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    marginBottom: MarginConstants.tab3
  },
  container: {
    alignItems: 'center',
  },
  logoImage: {
    height: '100%',
    width: '100%',
    marginTop: 2*MarginConstants.tab3
  },
  introView: {
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: MarginConstants.tab1,
    height:'50%'
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
