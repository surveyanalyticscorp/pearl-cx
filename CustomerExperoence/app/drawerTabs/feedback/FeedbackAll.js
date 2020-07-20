/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {Text, View, SafeAreaView, StyleSheet} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_AUTH_TOKEN} from '../../api/types';
const FeedbackAll = props => {

  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(ASYNC_AUTH_TOKEN);
    }
    getAuthToken().then(token => {
      const data = {
        pageOffset: 0,
        sentiment: 'All',
        month: '7',
        year: '2018',
      };
      props.getFeedbackList(
        data,
        'eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8iLCJ1aWQiOjE3MzI5LCJwaWQiOjEwMjY2LCJleHAiOjE1OTU3ODQ4NjEsImlhdCI6MTU5NTE4MDA2MSwiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8ifQ.IgySmtaHbBAqg4AHxUvmuZxPnfRZntV742Re_htE7W0',
      );
    });
  }, []);


  const renderFeedbackStatus = () => {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.counterContainer}>
          <Text style={styles.counterText}>
            {props.feedback.response.statusCode}
          </Text>
        </View>
      </SafeAreaView>
    );
  };

  return renderFeedbackStatus();
};

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  counterTitle: {
    fontFamily: 'System',
    fontSize: 32,
    fontWeight: '700',
    color: '#000',
  },
  counterText: {
    fontFamily: 'System',
    fontSize: 36,
    fontWeight: '400',
    color: '#000',
  },
  buttonText: {
    fontFamily: 'System',
    fontSize: 50,
    fontWeight: '300',
    color: '#007AFF',
    marginLeft: 40,
    marginRight: 40,
  },
});
export default FeedbackAll;
