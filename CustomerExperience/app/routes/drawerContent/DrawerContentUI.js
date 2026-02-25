import React, {useEffect} from 'react';
import {Platform, Pressable, Text, StyleSheet, View} from 'react-native';
import DeviceInfo from 'react-native-device-info';
import TicketSync from '../../components/TicketSync';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {Sizes} from '../../styles/Size.constant';
import ClosedLoopSvgIcon from '../../../assets/images/closed_loop.svg';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {useSelector} from 'react-redux';
import useLoginPersistence from './useLoginPersistance';
import useLogoutProcess from './useLogoutProcess';
import StringUtils from '../../Utils/StringUtils';
import TextLabel from '../../widgets/TextLabel/TextLabel';

export const AppVersion = () => {
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
export const UserName = () => {
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

export const RenderDrawerButtons = ({children}) => {
  return (
    <View>
      <TicketSync />
      {children}
    </View>
  );
};

export const RenderSettingsAndLogout = ({children}) => {
  return <View style={styles.drawerVersionContainer}>{children}</View>;
};

export const DrawerButton = ({
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
export const LogoutButtonIcon = () => {
  return (
    <FontIcon
      size={1.3 * Sizes.icons}
      color={Colors.accent}
      name={'sign-out-alt'}
      style={styles.rowIcon}
    />
  );
};

export const ClosedLoopIcon = ({isActive}) => (
  <View style={styles.rowIcon}>
    <ClosedLoopSvgIcon
      stroke={isActive ? Colors.accentLight : Colors.accent}
      height={1.3 * Sizes.icons}
      width={1.3 * Sizes.icons}
    />
  </View>
);
const styles = StyleSheet.create({
  drawerVersionContainer: {
    flex: 1,
    justifyContent: 'flex-end',
    marginBottom:
      Platform.OS === 'ios' ? MarginConstants.tab4 : MarginConstants.tab3,
  },
  drawerRow: {
    flexDirection: 'row',
    marginTop: MarginConstants.tab2,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  activeDrawerRow: {
    backgroundColor: Colors.white, // Add transparency to primary color
    borderRadius: 8,
    paddingVertical: PaddingConstants.halfTab,
  },
  labelStyle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.accent,
    paddingLeft: PaddingConstants.tab1,
  },
  activeLabelStyle: {
    fontFamily: FontFamily.regular,
    color: Colors.accentLight,
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
