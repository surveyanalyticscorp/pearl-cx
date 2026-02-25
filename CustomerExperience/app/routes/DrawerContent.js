import React, {useEffect, useState} from 'react';
import {View, Image, StyleSheet, Text, Platform, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {useSelector} from 'react-redux';
import {Sizes} from '../styles/Size.constant';
import {PaddingConstants} from '../styles/padding.constants';
import StringUtils from '../Utils/StringUtils';
import DeviceInfo from 'react-native-device-info';
import {DrawerActions} from '@react-navigation/native';
import {translate} from '../Utils/MultilinguaUtils';
import TicketSync from '../components/TicketSync';
import ClosedLoopSvgIcon from '../../assets/images/closed_loop.svg';
import DrawerBackground from './commonUI/DrawerBackground';
import TextLabel from '../../app/widgets/TextLabel/TextLabel';
import useLogoutProcess from './drawerContent/useLogoutProcess';
import logoutDialog from './drawerContent/LogoutDialog';
import ResponsesIcon from '../widgets/IconWidget/ResponsesIcon';
import useLoginPersistence from './drawerContent/useLoginPersistance';
import ListItemSeparator from './commonUI/ListItemSeparator';

const LogoutButtonIcon = () => {
  return (
    <FontIcon
      size={1.3 * Sizes.icons}
      color={Colors.accent}
      name={'sign-out-alt'}
      style={styles.rowIcon}
    />
  );
};
const DrawerCXLogo = () => {
  return (
    <Image
      style={styles.image}
      source={require('../config/images/cx_logo.png')}
      resizeMode="cover"
    />
  );
};

const AppVersion = () => {
  let {logoutAction} = useLogoutProcess();
  let isTokenExpired = useSelector(state => state.dashboard.isTokenExpired);
  useEffect(() => {
    if (isTokenExpired) {
      console.log('EXPIRED!');
      logoutAction();
    } else {
      console.log('not EXPIRED!');
    }
  }, [isTokenExpired]);
  return (
    <TextLabel style={styles.drawerVersionText}>
      {'v ' + DeviceInfo.getVersion()}
    </TextLabel>
  );
};
const UserName = () => {
  const userInfo = useSelector(state => state.global.userInfo);
  const {saveCredentials} = useLoginPersistence();
  const accessCode = useSelector(state => state.global.accessCode);
  console.log('USER_INFO', userInfo.emailAddress, accessCode);
  console.log('USER_INFO', 'DRAWER _content');
  let username = StringUtils.isNotEmpty(StringUtils.reformatName(userInfo))
    ? StringUtils.reformatName(userInfo)
    : userInfo.emailAddress;

  useEffect(() => {
    if (
      StringUtils.isNotEmpty(userInfo.emailAddress) &&
      StringUtils.isNotEmpty(accessCode)
    ) {
      saveCredentials(userInfo.emailAddress, accessCode);
    }
  }, [userInfo, accessCode]);
  return (
    <TextLabel
      text={username}
      style={{...styles.emailView, ...styles.emailCaption}}
    />
  );
};

const ClosedLoopIcon = ({isActive}) => (
  <View style={styles.rowIcon}>
    <ClosedLoopSvgIcon
      stroke={isActive ? Colors.accentLight : Colors.accent}
      height={1.3 * Sizes.icons}
      width={1.3 * Sizes.icons}
    />
  </View>
);

const DrawerResponsesIcon = ({isActive}) => (
  <View style={styles.rowIcon}>
    <ResponsesIcon
      color={isActive ? Colors.accentLight : Colors.accent}
      sizeMultiplyer={1.3}
    />
  </View>
);

const DrawerButtonIcon = ({name, isActive}) => (
  <Icon
    size={1.3 * Sizes.icons}
    color={isActive ? Colors.accentLight : Colors.accent}
    name={name}
    style={styles.rowIcon}
  />
);

const DrawerButton = ({
  dataObj,
  frontIcon,
  title,
  onPress,
  isActive = false,
}) => {
  return (
    <Pressable onPress={onPress ?? dataObj.onPress}>
      <View style={[styles.drawerRow, isActive && styles.activeDrawerRow]}>
        {frontIcon ?? dataObj.frontIcon}
        <Text style={[styles.labelStyle, isActive && styles.activeLabelStyle]}>
          {title ?? dataObj.title}
        </Text>
      </View>
    </Pressable>
  );
};

let RenderSettingsAndLogout = ({children}) => {
  return <View style={styles.drawerVersionContainer}>{children}</View>;
};
const RenderDrawerButtons = ({children}) => {
  return (
    <View>
      <TicketSync />
      {children}
    </View>
  );
};

const RenderWorkspaceInfo = () => {
  const {emailAddress, firstName, lastName, organizationName} = useSelector(
    state => state.global.userInfo,
  );
  return (
    <View style={{marginTop: MarginConstants.tab2}}>
      <ListItemSeparator />
      <TextLabel text={organizationName} style={styles.workspaceName} />

      <TextLabel text={firstName + ' ' + lastName} style={styles.userInfo} />
      <TextLabel text={emailAddress} style={styles.userInfo} />
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
      frontIcon: <DrawerButtonIcon name={'dashboard'} />,
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
      routeName: 'ClosedLoop',
      frontIcon: <ClosedLoopIcon />,
      onPress: () => {
        navigation.navigate('ClosedLoop');
      },
    },
    settings: {
      title: 'Settings',
      routeName: translate('settings.settings'),
      frontIcon: <DrawerButtonIcon name={'settings'} />,
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
            <DrawerButtonIcon
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
              isActive={currentRoute === buttonData['closedLoop'].routeName}
            />
          }
          dataObj={buttonData['closedLoop']}
          isActive={currentRoute === buttonData['closedLoop'].routeName}
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
          logoutDialog(logoutAction, () => {
            setLogoutAlert(false);
          })}
      </RenderSettingsAndLogout>
    </DrawerBackground>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
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
  labelStyle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
  emailCaption: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary,
    textAlign: 'auto',
  },
  drawerRow: {
    flexDirection: 'row',
    marginTop: MarginConstants.tab2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  rowIcon: {
    margin: MarginConstants.tab1,
  },
  drawerVersionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab3,
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
  activeDrawerRow: {
    backgroundColor: Colors.white, // Add transparency to primary color
    borderRadius: 8,
    paddingVertical: PaddingConstants.halfTab,
  },
  activeLabelStyle: {
    fontFamily: FontFamily.regular, // Make active text bold if you have medium weight
    color: Colors.accentLight,
  },
  workspaceName: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
  userInfo: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
});
