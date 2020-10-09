import React, {useEffect, useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
  Text, Alert
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import FontIcon from 'react-native-vector-icons/FontAwesome5';
import {Colors, textColors} from '../styles/color.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {FontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {clearUserInfo} from '../redux/actions';
import {connect} from 'react-redux';
import {ASYNC_USER_CREDENTIALS} from '../api/Constant';
import {Sizes} from '../styles/Size.constant';
import {PaddingConstants} from '../styles/padding.constants';

const DrawerContent = props => {
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
              <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'feedback'} style={styles.rowIcon}/>
              <Text style={styles.labelStyle}>Feedback</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Dashboard');
              }}>
            <View style={styles.drawerRow}>
              <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'dashboard'} style={styles.rowIcon}/>
              <Text style={styles.labelStyle}>Dashboard</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
              onPress={() => {
                props.navigation.navigate('Settings');
              }}>
            <View style={styles.drawerRow}>
              <Icon size={1.3*Sizes.icons} color={Colors.accent} name={'settings'} style={styles.rowIcon}/>
              <Text style={styles.labelStyle}>Settings</Text>
            </View>
          </TouchableWithoutFeedback>
          <TouchableWithoutFeedback
              onPress={() => {
                setLogoutAlert(true);
              }}>
            <View style={styles.drawerRow}>
              <FontIcon size={1.3*Sizes.icons} color={Colors.accent} name={'sign-out-alt'} style={styles.rowIcon}/>
              <Text style={styles.labelStyle}>Logout</Text>
            </View>
          </TouchableWithoutFeedback>
        </View>
    );
  };

  const renderDialog = () => {
    if(logoutAlert) {
      return (
          Alert.alert(
              'Are you sure you want to logout?',
              '',
              [
                {
                  text: 'Yes',
                  onPress: () => {
                    AsyncStorage.clear().then(() => {
                      props.logoutUser();
                      setLogoutAlert(false);
                    });
                  }
                },
                {   text: 'No',
                  onPress: () => {
                    setLogoutAlert(false)
                  }
                }
              ],
              { cancelable: false }
          )
      );
    }
    return <View/>
  };

  return (
      <View style={styles.container}>
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
              <Text style={styles.emailCaption}>
                {userCredentials ? userCredentials.email : ''}
              </Text>
            </View>
            {renderDrawerButtons()}
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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.primary,
    paddingLeft: PaddingConstants.tab1
  },
  emailCaption: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.primary
  },
  drawerRow: {
    flexDirection: 'row',
    marginTop: MarginConstants.tab2,
    justifyContent: 'flex-start',
    alignItems: 'center'
  },
  rowIcon: {
    margin: MarginConstants.tab1
  }
});
