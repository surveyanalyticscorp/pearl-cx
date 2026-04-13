import React, {useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {DrawerActions} from '@react-navigation/native';
import {translate} from '../Utils/MultilinguaUtils';
import DrawerBackground from './commonUI/DrawerBackground';
import useLogoutProcess from './drawerContent/useLogoutProcess';
import logoutDialog from './drawerContent/LogoutDialog';
import RenderWorkspaceInfo from './drawerContent/RenderWorkspaceInfo';
import {
  ClosedLoopIcon,
  DrawerButton,
  DrawerDashboardIcon,
  DrawerResponsesIcon,
  LogoutButtonIcon,
  RenderDrawerButtons,
  RenderSettingsAndLogout,
} from './drawerContent/DrawerContentUI';

import QuestionProBanner from '../../assets/images/questionpro_banner.svg';

const DrawerCXLogo = () => {
  const [containerWidth, setContainerWidth] = useState(0);

  return (
    <View
      style={styles.logoContainer}
      onLayout={e => setContainerWidth(e.nativeEvent.layout.width)}>
      {containerWidth > 0 && (
        <QuestionProBanner
          width={containerWidth * 0.9}
          height={containerWidth * 0.2}
        />
      )}
    </View>
  );
};

const DrawerContent = ({navigation}) => {
  const {logoutAction} = useLogoutProcess();
  const [logoutAlert, setLogoutAlert] = useState(false);

  // Get current route name
  const getCurrentRoute = () => {
    const state = navigation.getState();
    console.log('DrawerContent', state, state.routes[state.index]?.name);
    return state.routes[state.index]?.name;
  };

  const currentRoute = getCurrentRoute();

  const buttonData = {
    dashboard: {
      title: 'Dashboard',
      routeName: 'DashboardTab',
      frontIcon: <DrawerDashboardIcon name={'dashboard'} />,
      onPress: () => {
        navigation.navigate('DashboardTab');
      },
    },
    responses: {
      title: 'Responses',
      routeName: 'Responses',
      frontIcon: <DrawerResponsesIcon />,
      onPress: () => {
        navigation.navigate('Responses');
      },
    },
    closedLoop: {
      title: 'Closedloop',
      routeName: 'Closedloop',
      frontIcon: <ClosedLoopIcon />,
      onPress: () => {
        navigation.navigate('Closedloop');
      },
    },
    settings: {
      title: 'Settings',
      routeName: translate('settings.settings'),
      frontIcon: <DrawerDashboardIcon name={'settings'} />,
      onPress: () => {
        navigation.navigate(translate('settings.settings'));
      },
    },
    logout: {
      title: 'Logout',
      frontIcon: <LogoutButtonIcon />,
      onPress: () => {
        navigation.dispatch(DrawerActions.toggleDrawer());
        !logoutAlert && setLogoutAlert(true);
      },
    },
  };

  return (
    <DrawerBackground>
      <DrawerCXLogo />
      {/* <AppVersion /> */}
      {/* <UserName /> */}
      <RenderDrawerButtons>
        <DrawerButton
          frontIcon={
            <DrawerDashboardIcon
              name={'dashboard'}
              isActive={currentRoute === buttonData['dashboard'].routeName}
            />
          }
          dataObj={buttonData['dashboard']}
          isActive={currentRoute === buttonData['dashboard'].routeName}
        />
        <DrawerButton
          frontIcon={
            <DrawerResponsesIcon
              isActive={currentRoute === buttonData['responses'].routeName}
            />
          }
          dataObj={buttonData['responses']}
          isActive={currentRoute === buttonData['responses'].routeName}
        />
        <DrawerButton
          frontIcon={
            <ClosedLoopIcon
              isActive={currentRoute === buttonData['closedloop'].routeName}
            />
          }
          dataObj={buttonData['closedloop']}
          isActive={currentRoute === buttonData['closedloop'].routeName}
        />
      </RenderDrawerButtons>
      <RenderSettingsAndLogout>
        {/* <DrawerButton
          dataObj={buttonData['settings']}
          isActive={currentRoute === buttonData['settings'].routeName}
        /> */}
        <RenderWorkspaceInfo />

        <DrawerButton dataObj={buttonData['logout']} />
        {/* <LogoutButton navigation={navigation} /> */}
        {logoutAlert &&
          logoutDialog(
            () => {
              setLogoutAlert(false); // Reset immediately when user confirms
              logoutAction();
            },
            () => {
              setLogoutAlert(false);
            },
          )}
      </RenderSettingsAndLogout>
    </DrawerBackground>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  logoContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: MarginConstants.tab1,
  },
  container: {
    flex: 1,
    elevation: 5,
    zIndex: 100,
    backgroundColor: Colors.transparent,
  },
  imageBackgroundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    marginTop: MarginConstants.tab4,
    width: MarginConstants.tab4 * 6,
    height: MarginConstants.tab4 * 2,
  },

  emailCaption: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary,
    textAlign: 'auto',
  },

  rowIcon: {
    margin: MarginConstants.tab1,
  },

  drawerVersionText: {
    marginHorizontal: MarginConstants.tab1,
    marginBottom: MarginConstants.tab4,
    color: Colors.primary,
    fontSize: TextSizes.secondary,
    textAlign: 'right',
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
  emailView: {
    marginVertical: MarginConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
  },
});
