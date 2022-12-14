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
// import ResponseFeedback from './feedbackdetails/ResponseFeedback';
import ResponseProfile from './feedbackdetails/ResponseProfile';
import ResponseActivity from './feedbackdetails/ResponseActivity';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPanelMemberDetails,
  getSurveyResponseDetails,
} from '../../redux/actions/feedback.actions';

export default function FeedbackDetails(props) {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.global.authToken);
  const data = props.route.params.data;

  console.log('RESPONSE_DATA', JSON.stringify(props.route.params.data));

  dispatch(
    getPanelMemberDetails(authToken, {panelMemberID: data.panelMemberID}),
  );

  // dispatch(
  //   getSurveyResponseDetails(authToken, {
  //     surveyID: data.surveyID,
  //     responseID: data.responseSetID,
  //   }),
  // );

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
      component={renderScene}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.responseDataURL,
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.profile')}
      component={ResponseProfile}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.memberProfileURL,
        data: props.route.params.data,
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.activity')}
      component={ResponseActivity}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.activityURL,
        data: props.route.params.data,
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
