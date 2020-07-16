import React, {useEffect, Component} from 'react';
import {
  Text,
  View,
  SafeAreaView,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../../api/types';
import {getFeedbackList} from '../../actions';

const FeedbackAll = props => {
  useEffect(() => {
    async function getAuthToken() {
      return await AsyncStorage.getItem(AUTH_TOKEN);
    }

    getAuthToken().then(token => {
      if (token) {
        const data = {
          pageOffset: 0,
          sentiment: 'All',
          month: '7',
          year: '2018',
        };
        props.getFeedbackList(data, token);
      }
    });
  }, [props]);

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

// Map State To Props (Redux Store Passes State To Component)
const mapStateToProps = state => {
  console.log('State:');
  console.log(state);
  return {
    feedback: state.feedback,
  };
};
// Map Dispatch To Props (Dispatch Actions To Reducers. Reducers Then Modify The Data And Assign It To Your Props)
const mapDispatchToProps = dispatch => ({
  getFeedbackList: (data, token) => {
    dispatch(getFeedbackList(data, token));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbackAll);
