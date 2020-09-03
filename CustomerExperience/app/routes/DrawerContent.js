import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Text,
} from 'react-native';
import {Caption} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors, textColors} from '../styles/color.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {clearUserInfo} from '../redux/actions';
import {connect} from 'react-redux';
import {ASYNC_USER_CREDENTIALS} from '../api/Constant';
import DialogContainer from '../widgets/dialog/Container';
import DialogTitle from '../widgets/dialog/Title';
import DialogButton from '../widgets/dialog/Button';

const DrawerContent = props => {
  const [openDropper, setOpenDropper] = useState(false);
  const [userCredentials, setUserCredentials] = useState('');
  const [logoutAlert, setLogoutAlert] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(ASYNC_USER_CREDENTIALS).then((value) => {
      setUserCredentials(JSON.parse(value));
    })
  }, []);

  const renderDrawerButtons = () => {
    return (
        <View>
          <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Feedback');
              }}>
            <View style={styles.drawerRow}>
              <Image
                  source={require('../config/images/feedback_icon.png')}
                  resizeMode='contain'
                  style={styles.rowIcon}
              />
              <Caption style={styles.labelStyle}>Feedback</Caption>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Dashboard');
              }}>
            <View style={styles.drawerRow}>
              <Image
                  source={require('../config/images/dashboard_icon.png')}
                  resizeMode='contain'
                  style={styles.rowIcon}
              />
              <Caption style={styles.labelStyle}>Dashboard</Caption>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
              onPress={async () => {
                setLogoutAlert(true);
              }}>
            <View style={styles.drawerRow}>
              <Image
                  source={require('../config/images/logout.png')}
                  resizeMode='contain'
                  style={styles.rowIcon}
              />
              <Caption style={styles.labelStyle}>Logout</Caption>
            </View>
          </TouchableWithoutFeedback>
        </View>
    );
  };

  let getExpandIcon = () => {
    return openDropper ? 'expand-less' : 'expand-more';
  };

  const handleDialogCancel = () => {
    setLogoutAlert(false);
  };

  const handleDialogDone = () => {
    AsyncStorage.clear().then(() => {
      props.logoutUser();
      setLogoutAlert(false);
    });
  };

  const renderDialog = () => {
    return (
        <DialogContainer visible={logoutAlert}>
          <DialogTitle>Are you sure you want to logout?</DialogTitle>
          <DialogButton label={'No'} onPress={handleDialogCancel} />
          <DialogButton label={'Yes'} onPress={handleDialogDone} />
        </DialogContainer>
    );
  };

  const renderDropperView = () => {
    let firstName = props.userInfo.firstName;
    let lastName = props.userInfo.lastName;
    let organizationName = props.userInfo.organizationName;
    return (
        <View style={{marginTop: MarginConstants.tab1}}>
          {getDropperView('person', ' ' + firstName + ' ' + lastName)}
          {getDropperView('business', organizationName)}
          {getDropperView('email', userCredentials ? userCredentials.email : '')}
        </View>
    );
  };

  let getDropperView = (icon, text) => {
    return (
        <View style={styles.dropperView}>
          <Icon name={icon} size={20} color={Colors.black} />
          <Text style={styles.dropperText}>{' ' + text}</Text>
        </View>
    );
  };

  return (
      <View
          style={styles.container}>
        <ImageBackground
            resizeMode={'cover'}
            source={require('../config/images/drawerBanner.png')}
            style={styles.imageBackgroundContainer}>
          <View style={{flex: 1}}>
            <Image
                style={styles.image}
                source={require('../config/images/login_logo.png')}
                resizeMode='contain'
            />
            <View style={{marginTop: MarginConstants.halfTab}}>
              <Caption style={styles.emailCaption}>
                {userCredentials ? userCredentials.email : ''}
              </Caption>
              <Caption style={styles.companyCaptions}>
                {props.userInfo ? props.userInfo.organizationName : ''}
              </Caption>
              <TouchableWithoutFeedback
                  onPress={() => {
                    setOpenDropper(!openDropper);
                  }}>
                <View style={styles.expandIcon}>
                  <Icon
                      name={getExpandIcon()}
                      size={30}
                      color={Colors.secondary}
                  />
                </View>
              </TouchableWithoutFeedback>
            </View>
            {openDropper ? renderDropperView() : renderDrawerButtons()}
          </View>
          {renderDialog()}
        </ImageBackground>
      </View>
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
  };
};

const mapDispatchToProps = dispatch => ({
  logoutUser: data => {
    dispatch(clearUserInfo());
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(DrawerContent);

const styles = StyleSheet.create({
  container:{
    flex: 1,
    elevation: 5,
    zIndex: 100,
    backgroundColor: Colors.transparent,
  },
  imageBackgroundContainer:{
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image:{
    marginTop: MarginConstants.tab4,
    width: MarginConstants.tab4 * 6,
    height: MarginConstants.tab4 * 4,
  },
  labelStyle: {
    marginLeft: MarginConstants.tab3,
    fontFamily: FontFamily.Light,
    fontSize: TextSizes.primary,
  },
  emailCaption: {
    fontFamily: FontFamily.Light,
    fontSize: TextSizes.secondary,
  },
  companyCaptions: {
    fontFamily: FontFamily.Light,
    fontSize: TextSizes.secondary,
  },
  drawerSection: {
    marginTop: 15,
    backgroundColor: Colors.transparent,
  },
  dropperText: {
    fontFamily: FontFamily.Regular,
    fontSize: TextSizes.secondary,
    color: textColors.secondary,
  },
  dropperView: {
    flexDirection: 'row',
    height: MarginConstants.tab4,
  },
  drawerRow: {
    flexDirection: 'row',
    marginTop: MarginConstants.tab2
  },
  rowIcon: {
    width: 20,
    height: 30,
    tintColor: Colors.black
  },
  expandIcon: {
    position: 'absolute',
    right: 0,
    top: 20
  }
});
