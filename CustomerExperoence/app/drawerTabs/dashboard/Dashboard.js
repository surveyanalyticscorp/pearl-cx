import React, {useEffect, Component} from 'react';
import {View, Text} from 'react-native';

import {styles} from '../../styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../../api/types';

const Dashboard = props => {
  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(AUTH_TOKEN);
    }
    getAuthToken().then(token => {

    });
  });
  return (
    <View style={styles.center}>
      <Text style={styles.title}>Dashboard screen </Text>
    </View>
  );
};

export default Dashboard;
