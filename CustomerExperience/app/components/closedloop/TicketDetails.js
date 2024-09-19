import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useCallback} from 'react';
import {useWindowDimensions} from 'react-native';
import {Colors} from '../../styles/color.constants';

import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {RenderSpinner} from '../../routes/commonUI/CommonUI';
import {translate} from '../../Utils/MultilinguaUtils';
import TicketOverview from './TicketOverview';
import TicketComments from './TicketComments';
import TicketActivity from './TicketActivity';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopTicketItem} from '../../redux/actions/dashboard.actions';
import TicketRootCause from './TicketRootCause';
import {getResponseDetailsByResponseId} from '../../redux/actions/feedback.actions';
import StringUtils from '../../Utils/StringUtils';
import {
  getActionList,
  getRootCauseList,
} from '../../redux/actions/closedloop.actions';

export default function TicketDetails(props) {
  const authToken = useSelector(state => state.global.authToken);
  const isTicketLoading = useSelector(state => state.global.isTicketLoading);

  const feedbackApiKey = useSelector(
    state => state.global.userInfo.feedbackApiKey,
  );
  const ticketItem = props.route.params.ticketItem;
  const prevScreen = props.route.params.prevScreen;

  const dispatch = useDispatch();
  const windowDimensions = useWindowDimensions();

  console.log(`Ticket Detailsssss: ${JSON.stringify(ticketItem)}`);
  const TicketTabs = createMaterialTopTabNavigator();
  useEffect(() => {
    dispatch(getClosedLoopTicketItem(authToken, ticketItem.id, feedbackApiKey));
  }, []);

  const callApis = useCallback(authToken_ => {
    dispatch(getRootCauseList(authToken_, global.subscriberId));
    dispatch(getActionList(authToken_, global.subscriberId));
    if (!StringUtils.isEmptyOrNull(ticketItem.responseId)) {
      dispatch(
        getResponseDetailsByResponseId(authToken, {
          responseSetID: ticketItem.responseId,
        }),
      );
    }
  }, []);

  useEffect(() => {
    props.navigation.setOptions({
      title: `Ticket #${ticketItem.id}`,
    });
  }, [props.navigation, ticketItem.id]);

  useEffect(() => {
    if (authToken) {
      callApis(authToken);
      console.log('root API calls!');
    }
  }, [authToken]);

  // const CLFTicketTabStack = () => {
  return isTicketLoading ? (
    <RenderSpinner />
  ) : (
    <TicketTabs.Navigator
      tabBarOptions={{
        labelStyle: {
          width: windowDimensions.width / 4,
          fontSize: TextSizes.secondary,
          fontFamily: FontFamily.regular,
          textTransform: 'none',
        },
        indicatorStyle: {backgroundColor: Colors.accentLight},
        style: {backgroundColor: Colors.white, width: '100%'},
        initialLayout: {width: windowDimensions.width},
        tabStyle: {height: 1.3 * PaddingConstants.tab4},
        activeTintColor: Colors.accentLight,
        inactiveTintColor: Colors.primary,
      }}
      lazy
      keyboardDismissMode={'auto'}>
      <TicketTabs.Screen
        testID={'ticket-overview'}
        name={translate('close_loop.overview')}
        component={TicketOverview}
        initialParams={{
          screenName: translate('close_loop.overview'),
          prevScreen: prevScreen,
        }}
        op
      />
      <TicketTabs.Screen
        testID={'ticket-comments'}
        name={translate('close_loop.comments')}
        component={TicketComments}
        initialParams={{
          screenName: translate('close_loop.comments'),
          prevScreen: prevScreen,
        }}
      />
      <TicketTabs.Screen
        // name={translate('responses.activity')}
        testID={'ticket-activity'}
        name={'Activity log'}
        component={TicketActivity}
        initialParams={{screenName: 'Activity log'}}
      />

      <TicketTabs.Screen
        testID={'ticket-root-cause'}
        name={translate('root_cause.root_cause')}
        component={TicketRootCause}
        initialParams={{screenName: translate('root_cause.root_cause')}}
      />
    </TicketTabs.Navigator>
  );
}

// return false ? <RenderSpinner /> : <CLFTicketTabStack />;
// }
