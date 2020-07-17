import React, {useState} from 'react';
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  TouchableWithoutFeedback,
} from 'react-native';
import {useTheme, Caption} from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../styles/color.constants';
import AsyncStorage from '@react-native-community/async-storage';
import {fontFamily} from '../styles/font.constants';
import {TextSizes} from '../styles/textsize.constants';
import {MarginConstants} from '../styles/margin.constants';
import {doLogin} from '../actions';
import {connect} from 'react-redux';

//import {AuthContext} from '../components/context';

const DrawerContent = props => {
  const paperTheme = useTheme();
  const [openDropper, setOpenDropper] = useState(false);
  //const {signOut, toggleTheme} = React.useContext(AuthContext);

  const renderDrawerButtons = () => {
    return (
      <View>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('Feedback');
          }}>
          <View style={{flexDirection: 'row', marginTop: MarginConstants.tab2}}>
            <Image
              source={require('../images/feedback_icon.png')}
              resizeMode="contain"
              style={{width: 20, height: 30, tintColor: Colors.black}}
            />
            <Caption style={styles.labelStyle}>Feedback</Caption>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            props.navigation.navigate('Dashboard');
          }}>
          <View style={{flexDirection: 'row', marginTop: MarginConstants.tab2}}>
            <Image
              source={require('../images/dashboard_icon.png')}
              resizeMode="contain"
              style={{width: 20, height: 30, tintColor: Colors.black}}
            />
            <Caption style={styles.labelStyle}>Dashboard</Caption>
          </View>
        </TouchableWithoutFeedback>
        <TouchableWithoutFeedback
          onPress={() => {
            AsyncStorage.clear().then(() => {});
          }}>
          <View style={{flexDirection: 'row', marginTop: MarginConstants.tab2}}>
            <Image
              source={require('../images/logout.png')}
              resizeMode="contain"
              style={{width: 20, height: 30, tintColor: Colors.black}}
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

  return (
    <View
      style={{
        flex: 1,
        elevation: 5,
        zIndex: 100,
        backgroundColor: Colors.transparent,
      }}>
      <ImageBackground
        resizeMode={'stretch'}
        source={require('../images/drawerBanner.png')}
        style={{
          width: '100%',
          height: '100%',
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
        }}>
        <View style={{flex: 1}}>
          <Image
            style={{
              marginTop: MarginConstants.tab4,
              width: MarginConstants.tab4 * 6,
              height: MarginConstants.tab4 * 4,
            }}
            source={require('../images/login_logo.png')}
            resizeMode="contain"
          />
          <View style={{marginTop: MarginConstants.halfTab}}>
            <Caption style={styles.emailCaption}>
              datta.kunde@questionpro.com
            </Caption>
            <Caption style={styles.companyCaptions}>company Name</Caption>
            <TouchableWithoutFeedback
              onPress={() => {
                setOpenDropper(!openDropper);
              }}>
              <View style={{position: 'absolute', right: 0, top: 20}}>
                <Icon
                  name={getExpandIcon()}
                  size={30}
                  color={Colors.secondary}
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
          {!openDropper && renderDrawerButtons()}
        </View>
      </ImageBackground>
    </View>
  );
};

const mapStateToProps = state => {
  console.log('SignIn State:');
  console.log(state);
  return {
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
  };
};

const mapDispatchToProps = dispatch => ({
  loginClick: data => {
    dispatch(doLogin(data));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DrawerContent);

const styles = StyleSheet.create({
  labelStyle: {
    marginLeft: MarginConstants.tab3,
    fontFamily: fontFamily.Light,
    fontSize: TextSizes.primary,
  },
  emailCaption: {
    fontFamily: fontFamily.Light,
    fontSize: TextSizes.secondary,
  },
  companyCaptions: {
    fontFamily: fontFamily.Light,
    fontSize: TextSizes.secondary,
  },
  drawerSection: {
    marginTop: 15,
    backgroundColor: Colors.transparent,
  },
});
