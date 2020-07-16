import React, {useEffect, Component} from 'react';
import {Text, View} from 'react-native';
import {styles} from '../../styles/styles';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../../api/types';
import {apiHandler} from '../../api/ApiHandler';

const FeedbackAll = props => {
  useEffect(() => {
    let token =
      'eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8iLCJ1aWQiOjE3MzI5LCJwaWQiOjEwMjY2LCJleHAiOjE1OTU0MjEzNzcsImlhdCI6MTU5NDgxNjU3NywiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8ifQ.0QliYAgAIfKzpwfK4saiU38VLWt5DkGvXmUU_MdMMEk';
    let data = {pageOffset: 0, sentiment: 'All', month: '7', year: '2018'};
    let dashboard = apiHandler.getCXFeedbackList(token, data, false);
    let sections = dashboard.body;
    console.log('Responses: ' + JSON.stringify(sections));
  });

  return (
    <View style={styles.center}>
      <Text style={styles.title}>Feedback All </Text>
    </View>
  );
};

export default FeedbackAll;
