import React, {useEffect, useState} from 'react';
// import AsyncStorage from '@react-native-community/async-storage';
import {StyleSheet, ImageBackground, Text} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {View} from 'react-native-animatable';
import QPButton from '../../widgets/Button';
import {TextSizes} from '../../styles/textsize.constants';
import {FontFamily} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {useSelector, useDispatch} from 'react-redux';
import {
  getClosedLoopAllOwnersDetails,
  getClosedLoopOwnerDetails,
  getClosedLoopSegmentDetails,
  getWelcomeScreenDataCount,
} from '../../redux/actions/dashboard.actions';
// import QPSpinner from '../../widgets/QPSpinner';
import {RenderSpinner} from '../../routes/CommonScreen';
// import CreateTicket from './ticketManagement/CreateTicket';

export const WelcomeScreen = (props) => {
  const dispatch = useDispatch();
  const userInfo = useSelector((state) => state.global.userInfo);

  const authToken = useSelector((state) => state.global.authToken);
  const [subscriberId, setSubscriberId] = useState(global.subscriberId);
  const welcomeScreenData = useSelector(
    (state) => state.dashboard.welcomeScreenData,
  );
  // console.log('WELCOME_SCREEN', JSON.stringify(cxData));
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
    dispatch(getClosedLoopSegmentDetails(authToken));
    dispatch(
      getWelcomeScreenDataCount(authToken, {subscriberId: subscriberId}),
    );
    // dispatch(getClosedLoopAllOwnersDetails(authToken));
    dispatch(getClosedLoopOwnerDetails(authToken));
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
          <Text style={styles.welcomeText}>Welcome back</Text>
          <Text style={styles.nameText}>
            {(userInfo?.firstName === undefined ? '' : userInfo?.firstName) +
              ' ' +
              (userInfo?.lastName === undefined ? '' : userInfo?.lastName)}
          </Text>

          <View style={styles.responseContainer}>
            <RenderCountItem
              title={'New Responses'}
              data={welcomeScreenData?.cxData?.body?.newResponses ?? 0}
              style={styles.responseBox}
            />
          </View>
          <View style={styles.ticketAndOverdueContainer}>
            <RenderCountItem
              title={'New Tickets'}
              data={welcomeScreenData?.clfData?.data[0]?.value ?? 0}
              style={styles.ticketBox}
            />
            <RenderCountItem
              title={'Overdues'}
              data={welcomeScreenData?.clfData?.data[1]?.value ?? 0}
              style={styles.ticketBox}
            />
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

  skipButton: {
    fontSize: 18,
    fontWeight: '500',
    color: Colors.white,
    backgroundColor: Colors.accent,
    width: '90%',
    margin: 16,
  },
});
