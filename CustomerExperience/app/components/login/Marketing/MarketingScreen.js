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
import {Colors, textColors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Swiper from 'react-native-swiper';
import SafeAreaView from 'react-native-safe-area-view';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {StackActions} from '@react-navigation/native';
import {translate} from '../../../Utils/MultilinguaUtils';
import MarketingAsset1 from '../../../../assets/images/marketing_01.svg';
import MarketingAsset2 from '../../../../assets/images/marketing_02.svg';
import MarketingAsset3 from '../../../../assets/images/marketing_03.svg';
import MarketingAsset4 from '../../../../assets/images/marketing_04.svg';

const MarketingScreen = props => {
  let content = getMarketingScreenContent();

  let introPages = [];
  for (let i = 0; i < content.length; i++) {
    introPages.push(
      <View key={i}>
        <IntroPage {...content[i]} />
      </View>,
    );
  }

  const onPress = () => {
    const pushAction = StackActions.push('Login');
    props.navigation.dispatch(pushAction);
  };

  return (
    <SafeAreaView forceInset={{vertical: 'never'}} style={styles.safeAreaView}>
      <Swiper
        loop={false}
        showsButtons={false}
        dotColor={textColors.secondary}
        activeDotColor={Colors.accentLight}>
        {introPages}
      </Swiper>
      <Pressable
        testID="getStartedButton"
        style={styles.getStartedButton}
        onPress={onPress}>
        <Text style={styles.buttonTextColor}>
          {translate('onBoarding.signIn')}
        </Text>
      </Pressable>
    </SafeAreaView>
  );
};

function getMarketingScreenContent() {
  return [
    {
      image: <MarketingAsset1 />,
      introTitle: translate('onBoarding.marketing_title_1'),
      description: translate('onBoarding.marketing_desc_1'),
    },
    {
      image: <MarketingAsset2 />,
      introTitle: translate('onBoarding.marketing_title_2'),
      description: translate('onBoarding.marketing_desc_2'),
    },
    {
      image: <MarketingAsset3 />,
      introTitle: translate('onBoarding.marketing_title_3'),
      description: translate('onBoarding.marketing_desc_3'),
    },
    {
      image: <MarketingAsset4 />,
      introTitle: translate('onBoarding.marketing_title_4'),
      description: translate('onBoarding.marketing_desc_4'),
    },
  ];
}

export default MarketingScreen;

function IntroPage({image, introTitle, description}) {
  return (
    <View style={styles.introPageContainer}>
      <View style={styles.logoImageView}>{image}</View>
      <View style={styles.introView}>
        <Text style={styles.introTextHeader}>{introTitle}</Text>
        <Text style={styles.introText}>{description}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeAreaView: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingBottom:
      Platform.OS === 'ios' ? PaddingConstants.tab2 : PaddingConstants.tab1,
  },
  introPageContainer: {
    alignItems: 'center',
    justifyContent: 'flex-end',
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

  logoImage: {
    height: '100%',
    width: '100%',
  },
  introView: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: MarginConstants.tab1_4x,
  },

  logoImageView: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '80%',
    width: '100%',
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
