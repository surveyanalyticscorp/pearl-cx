import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/login/Login';
import ForgotPassword from '../components/login/ForgotPassword';
import MarketingScreen from '../components/login/MarketingScreen';
import ResetPassword from '../components/login/ResetPassword';
import {StyleSheet, Pressable} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {CommonActions} from '@react-navigation/native';
import {Colors} from '../styles/color.constants';
import {View} from 'react-native-animatable';
import {ASYNC_LOGGED_IN_ALREADY} from '../api/Constant';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {useSelector} from 'react-redux';

const RootStack = createStackNavigator();

const stackHeaderProps = (route, navigation) => {
  return (
    <View style={styles.headerButtonStyle}>
      <Pressable
        buttonStyle={styles.headerButtonStyle}
        onPress={() => {
          const popAction = CommonActions.goBack();
          navigation.dispatch(popAction);
        }}>
        <Icon name="arrow-left" size={20} color={Colors.white} />
      </Pressable>
    </View>
  );
};

const SignInStack = ({navigation}) => {
  const isFirstTime = useSelector(state => state.global.isFirstTime);

  console.log('isFirstTime', isFirstTime);
  return (
    <RootStack.Navigator>
      {isFirstTime && (
        <RootStack.Screen
          name="MarketingScreen"
          component={MarketingScreen}
          options={({route}) => ({
            headerShown: false,
          })}
        />
      )}
      <RootStack.Screen
        name="Login"
        component={Login}
        options={({navigation, route}) => ({
          headerTransparent: true,
          title: '',
          // headerLeft: props => {
          //   return isFirstTime && stackHeaderProps(route, navigation);
          // },
          headerShown: false,
        })}
      />

      <RootStack.Screen
        name="ForgotPassword"
        component={ForgotPassword}
        options={({navigation, route}) => ({
          headerTransparent: true,
          title: '',
          headerLeft: props => {
            return stackHeaderProps(route, navigation);
          },
        })}
      />
      <RootStack.Screen
        name="ResetPassword"
        component={ResetPassword}
        options={({navigation, route}) => ({
          headerTransparent: true,
          title: '',
          headerLeft: props => {
            return stackHeaderProps(route, navigation);
          },
        })}
      />
    </RootStack.Navigator>
  );
};

export default SignInStack;

const styles = StyleSheet.create({
  headerButtonStyle: {
    marginLeft: MarginConstants.tab1,
    flexDirection: 'row',
    paddingVertical: PaddingConstants.tab1,
  },
  transparentHeader: {
    backgroundColor: 'transparent',
    zIndex: 2,
    elevation: 0,
    shadowOpacity: 0,
    borderBottomWidth: 0,
  },
});
