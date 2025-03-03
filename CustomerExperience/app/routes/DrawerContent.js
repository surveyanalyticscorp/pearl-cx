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

const LogoutButtonIcon = () => {
  return (
    <FontIcon
      size={1.3 * Sizes.icons}
      color={Colors.filterIconColor}
      name={'sign-out-alt'}
      style={styles.rowIcon}
    />
  );
};
const DrawerCXLogo = () => {
  return (
    <Image
      style={styles.image}
      source={require('../config/images/cx-logo.png')}
      resizeMode="contain"
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
  let username = StringUtils.isNotEmpty(StringUtils.reformatName(userInfo))
    ? StringUtils.reformatName(userInfo)
    : userInfo.emailAddress;

  return (
    <TextLabel
      text={username}
      style={{...styles.emailView, ...styles.emailCaption}}
    />
  );
};

const ClosedLoopIcon = () => (
  <View style={styles.rowIcon}>
    <ClosedLoopSvgIcon height={1.3 * Sizes.icons} width={1.3 * Sizes.icons} />
  </View>
);

const DrawerButtonIcon = ({name}) => (
  <Icon
    size={1.3 * Sizes.icons}
    color={Colors.filterIconColor}
    name={name}
    style={styles.rowIcon}
  />
);

const DrawerButton = ({dataObj, frontIcon, title, onPress}) => {
  return (
    <Pressable onPress={onPress ?? dataObj.onPress}>
      <View style={styles.drawerRow}>
        {frontIcon ?? dataObj.frontIcon}
        <Text style={styles.labelStyle}>{title ?? dataObj.title}</Text>
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

const DrawerContent = ({navigation}) => {
  const {logoutAction} = useLogoutProcess();
  const [logoutAlert, setLogoutAlert] = useState(false);

  const buttonData = {
    dashboard: {
      title: 'Dashboard',
      frontIcon: <DrawerButtonIcon name={'dashboard'} />,
      onPress: () => {
        navigation.navigate('Dashboard');
      },
    },
    responses: {
      title: 'Responses',
      frontIcon: <DrawerButtonIcon name={'feedback'} />,
      onPress: () => {
        navigation.navigate('Responses');
      },
    },
    closedLoop: {
      title: 'Closedloop',
      frontIcon: <ClosedLoopIcon />,
      onPress: () => {
        navigation.navigate('ClosedLoop');
      },
    },
    settings: {
      title: 'Settings',
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
      <AppVersion />
      <UserName />
      <RenderDrawerButtons>
        <DrawerButton dataObj={buttonData['dashboard']} />
        <DrawerButton dataObj={buttonData['responses']} />
        <DrawerButton dataObj={buttonData['closedLoop']} />
      </RenderDrawerButtons>
      <RenderSettingsAndLogout>
        <DrawerButton dataObj={buttonData['settings']} />
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
    color: Colors.primary,
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
});
