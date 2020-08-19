import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/login/Login';
import CompanyCode from '../components/login/CompanyCode';
import ForgotPassword from '../components/login/ForgotPassword';
import MarketingScreen from '../components/login/MarketingScreen';
import ResetPassword from '../components/login/ResetPassword';
import {TouchableOpacity, View} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {useNavigation} from '@react-navigation/native';
const RootStack = createStackNavigator();

const HeaderLeft = () => {
  const navigation = useNavigation();
  return (
    <View style={{flexDirection: 'row'}}>
      <TouchableOpacity
        onPress={() => {
          navigation.goBack();
        }}>
        <Icon name="keyboard-arrow-left" size={35} color="white" />
      </TouchableOpacity>
    </View>
  );
};

const SignInStack = ({navigation}) => (
  <RootStack.Navigator headerMode="none">
    <RootStack.Screen
      name="MarketingScreen"
      component={MarketingScreen}
      options={{title: 'My home'}}
    />
    <RootStack.Screen name="CompanyCode" component={CompanyCode} />
    <RootStack.Screen name="Login" component={Login} />
    <RootStack.Screen name="ForgotPassword" component={ForgotPassword} />
    <RootStack.Screen name="ResetPassword" component={ResetPassword} />
  </RootStack.Navigator>
);

export default SignInStack;
