import React, {useEffect, useState} from 'react';
import {
  useWindowDimensions,
  StyleSheet,
  View,
  FlatList,
  BackHandler,
} from 'react-native';
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
  getResponseTickets,
  getSurveyResponseDetails,
} from '../../redux/actions/feedback.actions';
import ClosedLoopCell from '../closedloop/ClosedloopCell';
import ResponseTicketCell from '../closedloop/ResponseTicketCell';
import {
  getLatestComment,
  getTicketStatusHistory,
} from '../../redux/actions/closedloop.actions';
import {useIsFocused} from '@react-navigation/native';

export default function FeedbackDetails(props) {
  const dispatch = useDispatch();
  const authToken = useSelector((state) => state.global.authToken);
  const {feedbackApiKey, feedbackID} = useSelector(
    (state) => state.global.userInfo,
  );
  const isFocused = useIsFocused();
  const responseTickets = useSelector(
    (state) => state.response.responseTickets,
  );
  const data = props.route.params.data;
  const isFromFeedback = props.route.params.isFromFeedback;

  const [selectedTicketId, setSelectedTicket] = useState(0);
  console.log('RESPONSE_DATA', JSON.stringify(props.route.params.data));

  // dispatch(
  //   getPanelMemberDetails(authToken, {panelMemberID: data.panelMemberID}),
  // );

  // dispatch(
  //   getResponseTickets(authToken, feedbackID, data.responseSetID, {
  //     feedbackApiKey: feedbackApiKey,
  //   }),
  // );

  useEffect(() => {
    dispatch(
      getPanelMemberDetails(authToken, {panelMemberID: data.panelMemberID}),
    );

    dispatch(
      getResponseTickets(authToken, feedbackID, data.responseSetID, {
        feedbackApiKey: feedbackApiKey,
      }),
    );
  }, [isFocused]);
  useEffect(() => {
    console.log(
      'RESPONSE_DATA_RESPONSE_TICKETS',
      JSON.stringify(responseTickets),
    );

    if (responseTickets && responseTickets?.data?.length > 0) {
      dispatch(getLatestComment(authToken, responseTickets.data[0].id));
      dispatch(getTicketStatusHistory(authToken, responseTickets.data[0].id));
    }
  }, [responseTickets]);

  const onTapHandler = (item, index) => {
    console.log('TICKET_ITEM: ', JSON.stringify(item));
    dispatch(getLatestComment(authToken, `${item.id}`));
    dispatch(getTicketStatusHistory(authToken, `${item.id}`));
  };

  const onPressViewTicket = (item) => {
    props.navigation.navigate('TicketDetails', item);
  };

  // const onPressHandler = (item, index) => {
  //   props.navigation.navigate('TicketDetails', item);
  // };
  // dispatch(
  //   getSurveyResponseDetails(authToken, {
  //     surveyID: data.surveyID,
  //     responseID: data.responseSetID,
  //   }),
  // );

  const ShowTicketList = () => {
    const hasTickets =
      responseTickets &&
      responseTickets.data &&
      responseTickets.data.length > 0;

    return hasTickets ? (
      <FlatList
        lazy
        style={styles.flatlist}
        data={responseTickets.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return (
            <ResponseTicketCell
              data={item}
              index={index}
              selectedTicketId={selectedTicketId}
              onPressHandler={() => onTapHandler(item, index)}
              onPressViewTicket={() => onPressViewTicket(item)}
            />
          );
        }}
      />
    ) : (
      <View />
    );
  };

  return (
    <View style={styles.container}>
      <FeedbackDetailsTabStack {...props} />
      {isFromFeedback && (
        <FeedbackCell
          item={props.route.params.data}
          origin="Detail"
          hasTicket={responseTickets.data?.length > 0}
          ticketStatuses={props.route.params.ticketStatus}
          parentRoute={props.route.params.parentRoute}
          {...props}
        />
      )}
      {isFromFeedback && <ShowTicketList />}
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

  flatlist: {
    backgroundColor: Colors.grey,
    flex: 1,
    maxHeight: '50%',
    paddingTop: 5,
  },
});
