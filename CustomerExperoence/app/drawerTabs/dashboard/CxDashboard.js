import React, {useEffect, Component} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import {apiHandler} from '../../api/ApiHandler';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../../api/types';

const CxDashboard = props => {

    useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(AUTH_TOKEN);
    }
    getAuthToken().then(token => {
      let data = {surveyID: 123};
      apiHandler.getCXDashBoard(
        token,
        data,
        dashboard => {
          let sections = dashboard.body.sections;
        },
        error => {},
      );
    });
  });
  return (
    <View style={styles.center}>
      <Text style={styles.title}>CxDashboar screen </Text>
    </View>
  );
};

export default CxDashboard;
