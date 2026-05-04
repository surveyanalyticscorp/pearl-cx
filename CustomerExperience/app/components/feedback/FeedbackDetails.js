import React, {useEffect, useState} from 'react';
import {useWindowDimensions, StyleSheet, View, FlatList} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {TextSizes} from '../../styles/textsize.constants';
import QPWebView from '../../widgets/QPWebView';
import {PaddingConstants} from '../../styles/padding.constants';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';

import {translate} from '../../Utils/MultilinguaUtils';
import ResponseProfile from './feedbackdetails/ResponseProfile';
import ResponseActivity from './feedbackdetails/ResponseActivity';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  getPanelMemberDetails,
  getResponseTickets,
  setResponseReadList,
} from '../../redux/actions/feedback.actions';
import ResponseTicketCell from '../closedloop/ResponseTicketCell';
import {
  getLatestComment,
  getTicketStatusHistory,
} from '../../redux/actions/closedloop.actions';
import {useIsFocused} from '@react-navigation/native';
import AsyncStorage, {
  useAsyncStorage,
} from '@react-native-async-storage/async-storage';
import {ASYNC_RESPONSES_WITH_CX_MANAGER} from '../../api/Constant';

const RenderWebView = props => {
  return (
    <QPWebView
      child={<ShowResponseTicketList {...props} />}
      authToken={props.route.params.token}
      uri={props.route.params.url}
    />
  );
};
export const ShowResponseTicketList = props => {
  const [selectedTicketId, setSelectedTicket] = useState(0);
  const responseTickets = useSelector(state => state.response.responseTickets);

  const hasTickets =
    responseTickets && responseTickets.data && responseTickets.data.length > 0;

  const onTapHandler = (item, index) => {
    props.navigation.navigate('TicketDetails', {
      ticketItem: item,
      prevScreen: translate('dashboard.responses'),
    });
  };

  const onPressViewTicket = item => {
    props.navigation.navigate('TicketDetails', {
      ticketItem: item,
      prevScreen: translate('dashboard.responses'),
    });
  };

  return hasTickets ? (
    <FlatList
      testID="flatlist-feedback"
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

export default function FeedbackDetails(props) {
  const dispatch = useDispatch();
  const responseTickets = useSelector(state => state.response.responseTickets);

  const authToken = useSelector(state => state.global.authToken);
  const {feedbackApiKey, feedbackID} = useSelector(
    state => state.global.userInfo,
  );
  const isFocused = useIsFocused();
  const data = props.route.params.data;
  const isFromFeedback = props.route.params.isFromFeedback;
  const {getItem} = useAsyncStorage(ASYNC_RESPONSES_WITH_CX_MANAGER);

  console.log('RESPONSE_DATA', JSON.stringify(props.route.params.data));
  useEffect(() => {
    props.navigation.setOptions({
      title: `Response #${data.responseSetID}`,
      // title: 'Response details',
    });
  }, [props.navigation, data.responseSetID]);

  const asyncGetResponseIDs = async () => {
    try {
      let resIds = JSON.parse(await getItem());
      console.log(
        ASYNC_RESPONSES_WITH_CX_MANAGER,
        'RESPONSEIDssss',
        JSON.stringify(resIds),
      );

      dispatch(setResponseReadList(resIds !== null ? resIds : []));
      console.log(
        ASYNC_RESPONSES_WITH_CX_MANAGER,
        'RESPONSE IDs',
        resIds !== null ? resIds : [],
      );
    } catch (e) {
      console.log(ASYNC_RESPONSES_WITH_CX_MANAGER, 'CATCH', e);
    }
  };
  useEffect(() => {
    asyncGetResponseIDs();
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

  return (
    <View testID="feedback-details" style={styles.container}>
      <FeedbackDetailsTabStack isFromFeedback={isFromFeedback} {...props} />
    </View>
  );
}

const DetailsTab = createMaterialTopTabNavigator();

const FeedbackDetailsTabStack = props => (
  <DetailsTab.Navigator
    testID="tab-navigator"
    initialLayout={{width: useWindowDimensions().width}}
    screenOptions={{
      lazy: true,
      tabBarLabelStyle: {
        width: useWindowDimensions().width / 3,
        fontSize: TextSizes.secondary,
        fontFamily: FontFamily.regular,
        textTransform: 'none',
      },
      tabBarIndicatorStyle: {backgroundColor: Colors.accentLight},
      tabBarStyle: {backgroundColor: Colors.white, width: '100%'},
      tabBarItemStyle: {height: 1.2 * PaddingConstants.tab4},
      tabBarActiveTintColor: Colors.accentLight,
      tabBarInactiveTintColor: Colors.primary,
    }}
    keyboardDismissMode={'auto'}>
    <DetailsTab.Screen
      name={translate('responses.feedback')}
      component={RenderWebView}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.responseDataURL,
        data: props.route.params.data,
        isFromFeedback: props.isFromFeedback,
        screenName: translate('responses.feedback'),
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.profile')}
      component={ResponseProfile}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.memberProfileURL,
        data: props.route.params.data,
        isFromFeedback: props.isFromFeedback,
        screenName: translate('responses.profile'),
      }}
    />
    <DetailsTab.Screen
      name={translate('responses.activity')}
      component={ResponseActivity}
      initialParams={{
        token: props.route.params.token,
        url: props.route.params.data.activityURL,
        data: props.route.params.data,
        isFromFeedback: props.isFromFeedback,
        screenName: translate('responses.activity'),
      }}
    />
  </DetailsTab.Navigator>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 0,
  },

  flatlist: {
    backgroundColor: Colors.grey,
    paddingTop: 5,
  },
});
