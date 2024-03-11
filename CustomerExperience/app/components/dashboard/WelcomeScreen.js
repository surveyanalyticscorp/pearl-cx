import React, {useEffect, useState} from 'react';
// import AsyncStorage from '@react-native-async-storage/async-storage';
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
} from '../../redux/actions/dashboard.actions';
// import QPSpinner from '../../widgets/QPSpinner';
import {RenderSpinner} from '../../routes/CommonScreen';
import {
  ASYNC_BEARER_TOKEN,
  ASYNC_CLF_BASE_URL,
  BASE_URL,
  SUBSCRIBER_ID,
} from '../../api/Constant';
import {
  getActionList,
  getRootCauseList,
} from '../../redux/actions/closedloop.actions';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {translate} from '../../Utils/MultilinguaUtils';
import {buttonStyles} from '../../styles/button.styles';
import StringUtils from '../../Utils/StringUtils';
// import CreateTicket from './ticketManagement/CreateTicket';

export const WelcomeScreen = props => {
  const dispatch = useDispatch();
  const deviceType = Platform.OS === 'android' ? 0 : 1;
  const {baseUrl, bearerToken, authToken, userInfo} = useSelector(
    state => state.global,
  );

  // const authToken = useSelector((state) => state.global.authToken);
  // const [subscriberId, setSubscriberId] = useState(state.global.subscriberId);
  // const segmentDetails = useSelector((state) => state.dashboard.segmentDetails);
  const welcomeScreenData = useSelector(
    state => state.dashboard.welcomeScreenData,
  );
  // console.log('WELCOME_SCREEN', JSON.stringify(cxData));
  // console.log('WELCOME_SCREEN', JSON.stringify(welcomeScreenData));

  // const user = ;

  // let [moveNext, setMoveNext] = useState(false);
  // let splashTimer = useRef(null);

  // useEffect(() => {
  //   splashTimer = setTimeout(() => {
  //     setMoveNext(true);
  //   }, 3000);

  //   return () => {
  //     clearTimeout(splashTimer);
  //   };
  // }, []);

  // const onSkipHandler = () => {
  //   setMoveNext(true);
  //   clearTimeout(splashTimer);
  // };

  const setGlobalBaseUrl = baseUrl_ => {
    if (!StringUtils.isEmptyOrNull(baseUrl_) && global.baseUrl !== baseUrl_) {
      global.baseUrl = baseUrl_;
      AsyncStorage.setItem(BASE_URL, baseUrl_).then();
    }
  };

  const getWelcomeScreenData = () => {
    dispatch(
      getWelcomeScreenDataCount(authToken, {
        subscriberId: global.subscriberId,
        assignToId: userInfo.userID,
      }),
    );
  };

  AsyncStorage.getItem(ASYNC_CLF_BASE_URL).then(clfBase => {
    console.log(
      'Async Storage: saved clf base url from welcome screen',
      clfBase,
    );
    global.clfBaseUrl = clfBase;
  });

  AsyncStorage.getItem(ASYNC_BEARER_TOKEN).then(bearerToken_ => {
    console.log(
      'Async Storage: saved bearer token from welcome screen',
      bearerToken_,
    );
    global.bearerToken = bearerToken_;
  });

  useEffect(() => {
    if (authToken) {
      getSegmentData();
      getWelcomeScreenData();
    }
  }, [authToken]);

  useEffect(() => {
    setGlobalBaseUrl(baseUrl);
  }, [baseUrl]);

  useEffect(() => {
    if (
      welcomeScreenData?.cxData &&
      welcomeScreenData?.clfData &&
      !StringUtils.isEmptyOrNull(baseUrl)
    ) {
      getInitData(authToken);
    }
  }, [baseUrl, welcomeScreenData?.cxData, welcomeScreenData?.clfData]);

  const getSegmentData = () => {
    dispatch(
      getFirstTimeClosedLoopSegmentDetails(authToken, {pageOffset: '0'}),
    );
  };

  const getInitData = authToken_ => {
    // console.log('USER_DATA: ', userInfo, authToken);
    console.log('USER_DATA: ', userInfo);
    // dispatch(getClosedLoopSegmentDetails(authToken, {pageOffset: '0'}));
    console.log('SUBSCRIBER_ID', global.subscriberId);
    dispatch(
      callAppLoginCounter(authToken_, {
        cxUserId: userInfo.userID,
        deviceType: deviceType,
      }),
    );

    dispatch(getRootCauseList(authToken_, global.subscriberId));
    dispatch(getActionList(authToken_, global.subscriberId));
    // dispatch(getClosedLoopAllOwnersDetails(authToken));
    // dispatch(getClosedLoopOwnerDetails(authToken));
  };
  const CustomBackground = ({children}) => {
    return (
      <ImageBackground
        resizeMode={'cover'}
        source={require('../../config/images/background1.png')}
        style={styles.backgroundContainer}>
        {children}
      </ImageBackground>
    );
  };

  const RenderCountItem = ({style, title, data}) => {
    return (
      <View style={styles.ticketBox}>
        <Text style={styles.titleText}>{data}</Text>
        <Text style={styles.valueText}>{title}</Text>
      </View>
    );
  };

  const RenderWelcomeScreen = () => {
    return (
      <CustomBackground>
        <View style={styles.backgroundContainer}>
          <Text style={styles.welcomeText}>
            {translate('onBoarding.welcomeBack')}
          </Text>
          <Text style={styles.nameText}>
            {(userInfo?.firstName === undefined ? '' : userInfo?.firstName) +
              ' ' +
              (userInfo?.lastName === undefined ? '' : userInfo?.lastName)}
          </Text>

          <View style={styles.responseContainer}>
            <RenderCountItem
              title={translate('dashboard.new_responses')}
              data={welcomeScreenData?.cxData?.body?.newResponses ?? 0}
              style={styles.responseBox}
            />
          </View>
          <View style={styles.ticketAndOverdueContainer}>
            <RenderCountItem
              title={translate('dashboard.new_tickets')}
              data={welcomeScreenData?.clfData?.data[0]?.value ?? 0}
              style={styles.ticketBox}
            />
            <RenderCountItem
              title={translate('dashboard.overdues')}
              data={welcomeScreenData?.clfData?.data[1]?.value ?? 0}
              style={styles.ticketBox}
            />
          </View>
        </View>
        <View style={styles.skipButtonView}>
          <QPButton
            buttonText={translate('onBoarding.skip')}
            buttonColor={Colors.accentLight}
            onPress={props.skipHandler}
            textStyle={buttonStyles.primaryButtonText}
            style={buttonStyles.primaryButton}
          />
        </View>
      </CustomBackground>
    );
  };

  return welcomeScreenData.cxData && welcomeScreenData.clfData ? (
    <RenderWelcomeScreen />
  ) : (
    <CustomBackground>
      <RenderSpinner />
    </CustomBackground>
  );
};

const styles = StyleSheet.create({
  backgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeText: {
    fontSize: TextSizes.largeText,
    fontFamily: FontFamily.semiBold,
    color: Colors.accent,
    width: '80%',
  },
  nameText: {
    fontSize: TextSizes.extraLargeText,
    fontFamily: FontFamily.light,
    color: Colors.accent,
    width: '80%',
    marginBottom: MarginConstants.tab2,
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
