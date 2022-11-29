import React, {useEffect, useState} from 'react';
// import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet, ImageBackground, Text} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {View} from 'react-native-animatable';
import AppRouter from '../../routes/appRouter';
import QPButton from '../../widgets/Button';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_USER_CREDENTIALS, ASYNC_USER_INFO} from '../../api/Constant';
import {useSelector, useDispatch} from 'react-redux';
import {
  getClosedLoopSegmentDetails,
  getWelcomeScreenDataCount,
} from '../../redux/actions/dashboard.actions';
import QPSpinner from '../../widgets/QPSpinner';
// import CreateTicket from './ticketManagement/CreateTicket';

export const WelcomeScreen = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.global.userInfo);

  const authToken = useSelector((state) => state.global.authToken);
  const [subscriberId, setSubscriberId] = useState(global.subscriberId);
  const welcomeScreenData = useSelector(
    (state) => state.dashboard.welcomeScreenData.data,
  );
  console.log('WELCOME_SCREEN', JSON.stringify(welcomeScreenData));

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

  useEffect(() => {
    // console.log('USER_DATA: ', userInfo, authToken);
    // console.log('USER_DATA: ', userInfo);
    dispatch(getClosedLoopSegmentDetails(authToken, {statusID: 0}));
    dispatch(
      getWelcomeScreenDataCount(authToken, {subscriberId: subscriberId}),
    );
  }, [authToken, subscriberId]);

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

  let RenderSpinner = () => {
    return (
      <View style={styles.loading}>
        <QPSpinner />
      </View>
    );
  };

  const RenderWelcomeScreen = () => {
    return (
      <CustomBackground>
        <View style={styles.backgroundContainer}>
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.nameText}>
            {(userInfo?.firstName === undefined ? '' : userInfo?.firstName) +
              ' ' +
              (userInfo?.lastName === undefined ? '' : userInfo?.lastName)}
          </Text>

          <View style={styles.responseContainer}>
            <View style={styles.responseBox}>
              <Text style={styles.titleText}>{0}</Text>
              <Text style={styles.valueText}>New Responses</Text>
            </View>
          </View>
          <View style={styles.ticketAndOverdueContainer}>
            <View style={styles.ticketBox}>
              <Text style={styles.titleText}>
                {welcomeScreenData ? welcomeScreenData[0].value : 0}
              </Text>
              <Text style={styles.valueText}>New Tickets</Text>
            </View>
            <View style={styles.ticketBox}>
              <Text style={styles.titleText}>
                {welcomeScreenData ? welcomeScreenData[1].value : 0}
              </Text>
              <Text style={styles.valueText}>Over due</Text>
            </View>
          </View>
        </View>
        <View>
          <QPButton
            buttonText="SKIP"
            buttonColor={Colors.accentLight}
            onPress={props.skipHandler}
          />
        </View>
      </CustomBackground>
    );
  };

  return welcomeScreenData ? (
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

  skipButton: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
    backgroundColor: Colors.accent,
    width: '90%',
    margin: 16,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
