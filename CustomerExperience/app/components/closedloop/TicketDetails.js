import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect, useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  Image,
  StyleSheet,
  SafeAreaView,
  useWindowDimensions,
} from 'react-native';
import ClosedLoopCell from './ClosedloopCell';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';

import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {SearchIcon} from '../../routes/CommonScreen';
import style from '../../widgets/qp-calendar/calendar/header/style';
import {translate} from '../../Utils/MultilinguaUtils';
import TicketOverview from './TicketOverview';
import TicketComments from './TicketComments';
import TicketActivity from './TicketActivity';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {
  getClosedLoopTicketItem,
  getClosedLoopTicketItemActivity,
  getClosedLoopTicketItemComments,
} from '../../redux/actions/dashboard.actions';

export default function TicketDetails(props) {
  const {authToken} = useSelector((state) => state.global);
  const ticketItem = props.route.params;
  const dispatch = useDispatch();

  console.log('Ticket ID', ticketItem);
  const TicketTabs = createMaterialTopTabNavigator();

  useEffect(() => {
    // props.Navigator.screenName = 'Screen';
    dispatch(getClosedLoopTicketItem(authToken, ticketItem.id));
    dispatch(getClosedLoopTicketItemComments(authToken, ticketItem.id));
    dispatch(getClosedLoopTicketItemActivity(authToken, ticketItem.id));
  }, [dispatch, ticketItem, authToken]);

  const CLFTicketTabStack = () => {
    return (
      <TicketTabs.Navigator
        tabBarOptions={{
          labelStyle: {
            width: useWindowDimensions().width / 4,
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
        <TicketTabs.Screen
          name={translate('close_loop.overview')}
          component={TicketOverview}
          initialParams={{screenName: 'Overview'}}
        />
        <TicketTabs.Screen
          name={translate('close_loop.comments')}
          component={TicketComments}
          initialParams={{screenName: 'Comments'}}
        />
        <TicketTabs.Screen
          name={translate('responses.activity')}
          component={TicketActivity}
          initialParams={{screenName: 'Activity'}}
        />
      </TicketTabs.Navigator>
    );
  };

  return <CLFTicketTabStack />;
}
