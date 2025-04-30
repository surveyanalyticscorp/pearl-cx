import React, {useEffect, useRef} from 'react';
import {StyleSheet, ImageBackground, Text, Platform} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {View} from 'react-native-animatable';
import QPButton from '../../widgets/Button';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {useSelector, useDispatch} from 'react-redux';
import {
  callAppLoginCounter,
  getFirstTimeClosedLoopSegmentDetails,
  getWelcomeScreenDataCount,
  setMoveNext,
} from '../../redux/actions/dashboard.actions';
import {RenderSpinner} from '../../routes/commonUI/CommonUI';
import {
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  ASYNC_LOGGED_IN_ALREADY,
  BASE_URL,
  SUBSCRIBER_ID,
} from '../../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {translate} from '../../Utils/MultilinguaUtils';
import {buttonStyles} from '../../styles/button.styles';
import StringUtils from '../../Utils/StringUtils';
import {getGlobalSettings, setIsFirstTime} from '../../redux/actions';
import {sendAnalyticsEvent} from '../../Utils/AnalyticLogs';
import {
  ANALYTICS_EVENTS,
  ANALYTICS_EVENTS_SCREEN,
} from '../../Utils/Analytic.constants';
import AppInfo from '../../Utils/AppInfo';
import TextLabel from '../../widgets/TextLabel/TextLabel';
import {updateClfBaseUrl} from '../../redux/actions/login.actions';
import {
  getEmailTemplates,
  getDefaultEmailTemplate,
} from '../../redux/actions/closedloop.actions';

export const RenderCountItem = ({style, title, data}) => {
  return (
    <View testID="render-count-item" style={styles.ticketBox}>
      <Text style={styles.titleText}>{data}</Text>
      <Text style={styles.valueText}>{title}</Text>
    </View>
  );
};

const RenderCountData = () => {
  const {cxData, clfData} = useSelector(
    state => state.dashboard.welcomeScreenData,
  );

  return (
    <View testID="render-count-data">
      <View style={styles.responseContainer}>
        <RenderCountItem
          title={translate('dashboard.new_responses')}
          data={cxData?.body?.newResponses ?? 0}
          style={styles.responseBox}
        />
      </View>
      <View style={styles.ticketAndOverdueContainer}>
        <RenderCountItem
          title={translate('dashboard.new_tickets')}
          data={clfData?.data[0]?.value ?? 0}
          style={styles.ticketBox}
        />
        <RenderCountItem
          title={translate('dashboard.overdues')}
          data={clfData?.data[1]?.value ?? 0}
          style={styles.ticketBox}
        />
      </View>
    </View>
  );
};
const CustomBackground = ({children}) => {
  const {userInfo} = useSelector(state => state.global);
  useEffect(() => {
    sendAnalyticsEvent(ANALYTICS_EVENTS.APP_OPEN, {
      screen: ANALYTICS_EVENTS_SCREEN.WELCOME_SCREEN,
      ...AppInfo,
      ...userInfo,
    });
  }, []);
  return (
    <ImageBackground
      testID="custom-background"
      resizeMode={'cover'}
      source={require('../../config/images/background1.png')}
      style={styles.backgroundContainer}>
      {children}
    </ImageBackground>
  );
};

export const SkipButton = () => {
  const dispatch = useDispatch();
  // let [moveNext, setMoveNext] = useState(false);
  let splashTimer = useRef(null);
  const welcomeScreenData = useSelector(
    state => state.dashboard.welcomeScreenData,
  );
  useEffect(() => {
    if (welcomeScreenData) {
      splashTimer.current = setTimeout(() => {
        dispatch(setMoveNext(true));
      }, 5000);
      return () => {
        clearTimeout(splashTimer.current);
      };
    }
  }, [welcomeScreenData]);

  const onSkipHandler = () => {
    console.log('SKIP!!');
    dispatch(setMoveNext(true));

    if (splashTimer.current) {
      clearTimeout(splashTimer.current);
    }
  };

  return (
    <View testID="skip-button-view" style={styles.skipButtonView}>
      <QPButton
        buttonText={translate('onBoarding.skip')}
        buttonColor={Colors.accentLight}
        onPress={onSkipHandler}
        textStyle={buttonStyles.primaryButtonText}
        style={buttonStyles.primaryButton}
      />
    </View>
  );
};

const UserName = () => {
  const {firstName, lastName} = useSelector(state => state.global.userInfo);
  return (
    <TextLabel
      text={`${firstName ?? ''} ${lastName ?? ''}`}
      style={styles.nameText}
    />
  );
};

const RenderWelcomeScreen = () => {
  return (
    <View testID="render-welcome-screen" style={styles.backgroundContainer}>
      <View style={styles.backgroundContainer}>
        <Text testID="welcome-text" style={styles.welcomeText}>
          {translate('onBoarding.welcomeBack')}
        </Text>
        <UserName />
        <RenderCountData />
      </View>
      <SkipButton />
    </View>
  );
};

const LoadWelcomeScreen = () => {
  const {cxData, clfData} = useSelector(
    state => state.dashboard.welcomeScreenData,
  );

  return (
    <CustomBackground>
      {cxData && clfData ? <RenderWelcomeScreen /> : <RenderSpinner />}
    </CustomBackground>
  );
};
export const WelcomeScreen = () => {
  const dispatch = useDispatch();
  const deviceType = Platform.OS === 'android' ? 0 : 1;
  const {baseUrl, authToken, userInfo} = useSelector(state => state.global);

  const setGlobalBaseUrl = baseUrl_ => {
    AsyncStorage.setItem(ASYNC_LOGGED_IN_ALREADY, 'true');
    dispatch(setIsFirstTime(false));
    AsyncStorage.getItem(ASYNC_CLF_BASE_URL).then(clfBase => {
      console.log(
        'Async Storage: saved clf base url from welcome screen',
        clfBase,
      );
      global.clfBaseUrl = clfBase;
      dispatch(updateClfBaseUrl(clfBase));
    });

    AsyncStorage.getItem(ASYNC_BEARER_TOKEN).then(bearerToken_ => {
      console.log(
        'Async Storage: saved bearer token from welcome screen',
        bearerToken_,
      );
      global.bearerToken = bearerToken_;
    });

    if (!StringUtils.isEmptyOrNull(baseUrl_) && global.baseUrl !== baseUrl_) {
      global.baseUrl = baseUrl_;
      AsyncStorage.setItem(BASE_URL, baseUrl_).then();
    }
  };

  const getWelcomeScreenData = authToken_ => {
    dispatch(
      getWelcomeScreenDataCount(authToken_, {
        subscriberId: global.subscriberId,
        assignToId: userInfo.userID,
      }),
    );
  };

  const getSegmentData = authToken_ => {
    dispatch(
      getFirstTimeClosedLoopSegmentDetails(authToken_, {pageOffset: '0'}),
    );
  };

  const getInitData = () => {
    console.log('USER_DATA: ', userInfo);
    console.log('SUBSCRIBER_ID', global.subscriberId);
    dispatch(getGlobalSettings());
    dispatch(
      callAppLoginCounter('', {
        cxUserId: userInfo.userID,
        deviceType: deviceType,
      }),
    );
    dispatch(
      getDefaultEmailTemplate(authToken, {subscriberId: global.subscriberId}),
    );
    dispatch(getEmailTemplates(authToken, {subscriberId: global.subscriberId}));
  };

  useEffect(() => {
    if (StringUtils.isNotEmpty(baseUrl)) {
      setGlobalBaseUrl(baseUrl);
    }
  }, [baseUrl]);

  useEffect(() => {
    if (
      authToken &&
      StringUtils.isNotEmpty(authToken) &&
      global.bearerToken &&
      global.clfBaseUrl
    ) {
      getSegmentData(authToken);
      getWelcomeScreenData(authToken);
      getInitData();
    }
  }, [authToken]);

  return <LoadWelcomeScreen />;
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  welcomeText: {
    fontSize: TextSizes.largeText,
    fontFamily: FontFamily.semiBold,
    color: Colors.accent,
    width: '80%',
    textAlign: 'center',
  },
  nameText: {
    fontSize: TextSizes.extraLargeText,
    fontFamily: FontFamily.light,
    color: Colors.accent,
    width: '80%',
    marginBottom: MarginConstants.tab2,
    textAlign: 'center',
  },
  titleText: {
    fontSize: TextSizes.largeText,
    fontFamily: FontFamily.semiBold,
    color: Colors.accent,
    textAlign: 'center',
  },
  valueText: {
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    color: Colors.accent,
    textAlign: 'center',
  },

  responseBox: {
    flex: 1,
    alignContent: 'stretch',
    borderColor: Colors.accent,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
  },

  responseContainer: {
    flexDirection: 'row',
    width: '80%',
  },
  ticketBox: {
    flex: 2,
    alignContent: 'stretch',
    borderColor: Colors.borderColor,
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderRadius: 5,
    marginVertical: 8,
    marginHorizontal: 4,
    padding: 16,
  },
  ticketAndOverdueContainer: {
    flexDirection: 'row',
    alignContent: 'space-around',
    justifyContent: 'center',
    width: '80%',
  },

  skipButtonView: {
    width: '90%',
    marginBottom:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab2,
  },
});
