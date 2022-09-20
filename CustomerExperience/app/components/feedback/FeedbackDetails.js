import React from 'react';
import {useWindowDimensions, StyleSheet, View} from 'react-native';
import FeedbackCell from './FeedbackCells';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import QPWebView from '../../widgets/QPWebView';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
// import ActionButton from 'react-native-action-button';
// import Icon from 'react-native-vector-icons/MaterialIcons';
import {translate} from '../../Utils/MultilinguaUtils';
import ResponseFeedback from './feedbackdetails/ResponseFeedback';
import ResponseProfile from './feedbackdetails/ResponseProfile';
import ResponseActivity from './feedbackdetails/ResponseActivity';
import {FontFamily} from '../../styles/font.constants';

export default function FeedbackDetails(props) {
  return (
    <View style={styles.container}>
      <FeedbackDetailsTabStack {...props} />
      <FeedbackCell
        item={props.route.params.data}
        origin="Detail"
        ticketStatuses={props.route.params.ticketStatus}
        parentRoute={props.route.params.parentRoute}
        {...props}
      />
      {/** enable it when email functionality */}
      {/*<ActionButton*/}
      {/*buttonColor= {Colors.accent}*/}
      {/*buttonTextStyle={{fontSize: TextSizes.donutPercentText}}*/}
      {/*onPress={() => { alert("open email screen")}}*/}
      {/*renderIcon={() => {return <Icon size={30} name="email" color={Colors.white} />}}*/}
      {/*/>*/}
    </View>
  );
}

const DetailsTab = createMaterialTopTabNavigator();

const questions = [
  {
    id: 1,
    question:
      'How likely is it that you would recommend our company to a friend or colleague?',
    answer: '4',
  },
  {
    id: 2,
    question: 'What is the primary reason for your score?',
    answer: 'The manager was super rude to us! ',
  },
  {
    id: 3,
    question:
      'How likely is it that you would recommend our company to a friend or colleague?',
    answer: '4',
  },
  {
    id: 4,
    question: 'What is the primary reason for your score?',
    answer: 'The manager was super rude to us! ',
  },
  {
    id: 5,
    question: 'Different question with another comment from client?',
    answer: 'Not happy about the service ',
  },
  {
    id: 6,
    question: 'What is the primary reason for your score?',
    answer: 'The manager was super rude to us! ',
  },
  {
    id: 7,
    question: 'Different question with another comment from client?',
    answer: 'Not happy about the service ',
  },
];

const profileData = {
  name: 'Jessica Palm',
  email: 'jessica.plam@rocker.com',
  phone: '+1 923 978 3434',
  ticketCount: '4',
  surveyCount: '1',
  date: 'Dec 21, 2021',
};

const activityData = {
  surveyHistory: {
    sentDate: 'Jan 28, 2022',
    completeDate: 'Oct 8, 2022',
    comment: 'Made some comments about the response and responed by SMS',
    managerName: 'FBB Manager',
    lastUpdated: 'Oct 8, 2022',
  },
  history: [
    {
      status: 'new',
    },
    {
      status: 'open',
    },
    {
      status: 'resolved',
    },
  ],
};

const FeedbackDetailsTabStack = (props) => (
  <DetailsTab.Navigator
    tabBarOptions={{
      labelStyle: {
        width: useWindowDimensions().width / 3,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.secondary,
      },
      indicatorStyle: {backgroundColor: Colors.accentLight},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: useWindowDimensions().width},
      tabStyle: {height: 1.2 * PaddingConstants.tab4},
      activeTintColor: Colors.accentLight,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <DetailsTab.Screen
      name={translate('responses.feedback')}
      component={ResponseFeedback}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.responseDataURL,
        listData: questions,
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.profile')}
      component={ResponseProfile}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.memberProfileURL,
        data: profileData,
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.activity')}
      component={ResponseActivity}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.activityURL,
        data: activityData,
      }}
    />
  </DetailsTab.Navigator>
);

const renderScene = (props) => {
  return (
    <QPWebView
      authToken={props.route.params.token}
      uri={props.route.params.url}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 5,
  },
});
