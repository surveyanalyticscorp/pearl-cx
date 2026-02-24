import {StyleSheet, Text, Pressable, View} from 'react-native';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CxDashboard from '../components/dashboard/CxDashboard';
import SearchTicket from '../components/dashboard/components/SearchTicket';
import {TextSizes} from '../styles/textsize.constants';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {FontFamily} from '../styles/font.constants';
import CommonScreens from './CommonScreen';
import {CloseButton} from './commonUI/CommonUI';
import MenuIcon from './commonUI/MenuIcon';
import SegmentSelector from '../components/SegmentSelector';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import Feedback from '../components/feedback/Feedback';
import {translate} from '../Utils/MultilinguaUtils';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import PushNotification from '../components/notifications/PushNotifications';

const DetractorStack = createStackNavigator();

const DashboardModalStack = props => (
  <DetractorStack.Navigator screenOptions={{presentation: 'modal'}}>
    <DetractorStack.Screen
      name="Dashboard"
      component={dashboardStack}
      options={({navigation, route}) => ({headerShown: false})}
    />
    {/* <DetractorStack.Screen
      key={'Notifications'}
      name="Notifications"
      component={PushNotification}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft />,
      })}
    /> */}

    <DetractorStack.Screen
      name={translate('filter_by')}
      component={TicketFilter}
      options={({navigation, route}) => ({
        headerLeft: props => <View />,
        headerRight: props => <CloseButton />,
      })}
    />
  </DetractorStack.Navigator>
);

const dashboardStack = props => (
  <DetractorStack.Navigator>
    <DetractorStack.Screen
      name={translate('dashboard.dashboard')}
      component={CxDashboard}
      options={({navigation, route}) => ({
        headerTitle: props => {
          return (
            <SegmentSelector
              screenName={translate('dashboard.dashboard')}
              navigation={navigation}
            />
          );
        },

        headerLeft: props => <MenuIcon />,
      })}
    />

    <DetractorStack.Screen
      name="Search Ticket"
      component={SearchTicket}
      options={({navigation, route}) => ({
        headerShown: false,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />

    <DetractorStack.Screen
      key={'dashboard_to_responses'}
      name={'dashboard_to_responses'}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,

        headerTitle: props => {
          return (
            <SegmentSelector screenName={'Responses'} navigation={navigation} />
          );
        },
        headerShown: true,
      })}
    />
    <DetractorStack.Screen
      key={'dashboard_to_closed_loop'}
      name={'dashboard_to_closed_loop'}
      component={ClosedLoop}
      options={({navigation, route}) => ({
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,

        headerTitle: props => {
          return (
            <SegmentSelector
              screenName={'ClosedLoop'}
              navigation={navigation}
            />
          );
        },
        headerShown: true,
      })}
    />
    {CommonScreens(DetractorStack)}
  </DetractorStack.Navigator>
);

export default DashboardModalStack;

const styles = StyleSheet.create({
  rightHeaderButton: {
    flexDirection: 'row',
    marginLeft: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  saveText: {
    color: Colors.white,
    textAlignVertical: 'center',
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    paddingTop: 5,
    paddingLeft: 5,
  },
});
