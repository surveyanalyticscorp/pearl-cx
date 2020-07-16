import React, {useEffect, Component} from 'react';
import {
  Text,
  View,
  Dimensions,
  SafeAreaView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import {connect} from 'react-redux';
import AsyncStorage from '@react-native-community/async-storage';
import {AUTH_TOKEN} from '../../api/types';
import {apiHandler} from '../../api/ApiHandler';
import {increaseCounter, getFeedbackList} from '../../actions';

const {height, width} = Dimensions.get('window');

const FeedbackAll = props => {
  useEffect(() => {
    /*let token =
      'eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8iLCJ1aWQiOjE3MzI5LCJwaWQiOjEwMjY2LCJleHAiOjE1OTU0MjEzNzcsImlhdCI6MTU5NDgxNjU3NywiYWxnIjoiSFMyNTYifQ.eyJpc3MiOiJodHRwczovL3FhLnF1ZXN0aW9ucHJvLmNvbS8ifQ.0QliYAgAIfKzpwfK4saiU38VLWt5DkGvXmUU_MdMMEk';
    let data = {pageOffset: 0, sentiment: 'All', month: '7', year: '2018'};
    let dashboard = apiHandler.getCXFeedbackList(token, data, false);
    let sections = dashboard.body;
    console.log('Responses: ' + JSON.stringify(sections));*/
  });
  //let data = {pageOffset: 0, sentiment: 'All', month: '7', year: '2018'};
  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.counterTitle}>Counter</Text>
      <View style={styles.counterContainer}>
        <TouchableOpacity onPress={props.getFeedbackList}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
        <Text style={styles.counterText}>
          {props.feedback.response.statusCode}
        </Text>
        <TouchableOpacity onPress={props.getFeedbackList}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
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
  getFeedbackList: () => {
    dispatch(getFeedbackList());
  },
  reduxIncreaseCounter: () => {
    dispatch(increaseCounter(true));
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(FeedbackAll);
