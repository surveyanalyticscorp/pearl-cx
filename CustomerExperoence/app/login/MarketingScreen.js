import React, {useState, useEffect} from 'react';
import {isLandscape} from '../Utils/DeviceUtil';
import {ImageBackground, StyleSheet} from 'react-native';
import {TouchableOpacity, View, Text} from 'react-native';
import {Colors, textColors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import IntroPage from './IntroPage';
import Swiper from 'react-native-swiper'; //https://www.npmjs.com/package/react-native-swiper

const MarketingScreen = props => {
  const [orientation, setOrientation] = useState(isLandscape());

  const [index, setIndex] = useState(0);

  let content = getMarketingScreenContent();

  let introPages = [];
  for (let i = 0; i < content.length; i++) {
    introPages.push(
      <View key={i}>
        <IntroPage orientation={orientation} marketingComponent={content[i]} />
      </View>,
    );
  }

  const onPress = () => {
    props.navigation.navigate('CompanyCodeScreen');
  };

  return (
    <View style={{flex: 1}}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/background.png')}
        style={styles.imageBackgroundContainer}>
        <Swiper
          loop={false}
          style={styles.wrapper}
          showsButtons={false}
          dotColor={textColors.secondary}
          activeDotColor={textColors.primary}
          onIndexChanged={index => {
            setIndex(index);
          }}>
          {introPages}
        </Swiper>
      </ImageBackground>

      {index === 4 ? (
        <TouchableOpacity style={styles.button} onPress={onPress}>
          <Text>Get Started</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
};

function getMarketingScreenContent() {
  return [
    {
      introImage: require('../images/ms_connect_engage.png'),
      isLogoRequired: true,
      introTitle: 'Connect and engage with your customers. Anytime, anywhere',
      description:
        'Communicate with customers or prospects through a wide selection of feedback channels at every touchpoint anywhere, no matter the device.',
    },
    {
      introImage: require('../images/ms_take_control.png'),
      introTitle: 'Take full control of your customer’s journey',
      isLogoRequired: true,
      description:
        'Analyze your customer’s 360 experience and quickly identify actionable insights and trends.',
    },
    {
      introImage: require('../images/ms_mobile_dashboard.png'),
      introTitle: 'Manage real-time analytics in one dashboard',
      isLogoRequired: true,
      description:
        'Easily monitor your business with the role-based, customizable dashboard from anywhere.',
    },
    {
      introImage: require('../images/ms_drive_business_decisions.png'),
      introTitle: 'Make immediate business decisions',
      isLogoRequired: true,
      description:
        'Prioritize actions quickly based on customer data to excel their expectations with our closed-loop feedback system with real-time alerts.',
    },
    {
      introImage: require('../images/ms_full_growth.png'),
      introTitle: 'Fuel growth organically',
      isLogoRequired: true,
      description:
        'Identify your best customers and help them become your brand ambassadors through social referrals with our unique Promoter Amplification system.',
    },
  ];
}

export default MarketingScreen;

const styles = StyleSheet.create({
  safeAreaView: {
    flex: 1,
    backgroundColor: Colors.darkerGrey,
  },
  imageBackgroundContainer: {
    width: '100%',
    height: '100%',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  marketingContainer: {
    flex: 1,
    backgroundColor: Colors.darkerGrey,
  },

  dot: {
    width: TextSizes.smallText,
    height: TextSizes.smallText,
    borderRadius: TextSizes.smallText / 2,
    backgroundColor: Colors.dotColor,
    marginLeft: MarginConstants.halfTab,
    marginRight: MarginConstants.halfTab,
  },

  selectedDot: {
    backgroundColor: Colors.dotSelectedColor,
  },

  button: {
    alignItems: 'center',
    backgroundColor: '#DDDDDD',
    padding: 10,
    position: 'absolute',
    bottom: 10,
    right: 10,
    width: 100,
    height: 40,
  },
});
