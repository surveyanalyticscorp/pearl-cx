import React from 'react';

import {createStackNavigator} from '@react-navigation/stack';
import Login from '../components/login/Login';
import CompanyCode from '../components/login/CompanyCode';
import ForgotPassword from '../components/login/ForgotPassword';
import MarketingScreen from '../components/login/MarketingScreen';
import ResetPassword from '../components/login/ResetPassword';
import {TouchableOpacity, StyleSheet} from 'react-native';
import Icon from 'react-native-vector-icons/SimpleLineIcons';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import { CommonActions } from '@react-navigation/native';
import {Colors} from '../styles/color.constants';

const RootStack = createStackNavigator();

const stackHeaderProps = (route, navigation) => {
    return (
        <TouchableOpacity
            buttonStyle={styles.headerButtonStyle}
            onPress={() => {
                const popAction = CommonActions.goBack();
                navigation.dispatch(popAction)
            }}>
            <Icon name="arrow-left" size={20} color= {Colors.white}/>
        </TouchableOpacity>
    )
};

const SignInStack = ({navigation}) => (
    <RootStack.Navigator >
        <RootStack.Screen name="MarketingScreen" component={MarketingScreen}
                          options={({ route }) => ({
                              headerShown:false
                          })}
        />
        <RootStack.Screen name="CompanyCode" component={CompanyCode}
                          options={({ navigation, route }) => ({
                              headerTransparent: true,
                              title:'',
                              headerLeft: (props) => {
                                  return stackHeaderProps(route, navigation)
                              },
                          })}/>
        <RootStack.Screen name="Login" component={Login}
                          options={({ navigation, route }) => ({
                              headerTransparent: true,
                              title:'',
                              headerLeft: (props) => {
                                  return stackHeaderProps(route, navigation)
                              },
                          })}
        />
        <RootStack.Screen name="ForgotPassword" component={ForgotPassword}
                          options={({ navigation, route }) => ({
                              headerTransparent: true,
                              title:'',
                              headerLeft: (props) => {
                                  return stackHeaderProps(route, navigation)
                              }
                          })}
        />
        <RootStack.Screen name="ResetPassword" component={ResetPassword}
                          options={({ navigation, route }) => ({
                              headerTransparent: true,
                              title:'',
                              headerLeft: (props) => {
                                  return stackHeaderProps(route, navigation)
                              },
                          })}
        />
    </RootStack.Navigator>
);

export default SignInStack;

const styles = StyleSheet.create({
    headerButtonStyle:{
        marginLeft: MarginConstants.tab2,
        flexDirection: 'row',
        paddingLeft:PaddingConstants.tab2,
        paddingVertical:PaddingConstants.tab1,
    },
    transparentHeader: {
        backgroundColor: 'transparent',
        zIndex: 2,
        elevation: 0,
        shadowOpacity: 0,
        borderBottomWidth: 0,
    },
});
