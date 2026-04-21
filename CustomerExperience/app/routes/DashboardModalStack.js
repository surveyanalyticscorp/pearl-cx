import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import TicketFilter from '../components/dashboard/components/TicketFilter';
import {CloseButton} from './commonUI/CommonUI';
import {translate} from '../Utils/MultilinguaUtils';
import CxDashboard from '../components/dashboard/CxDashboard';
import SegmentSelector, {
  NotiificationIcon,
} from '../components/SegmentSelector';
import MenuIcon from './commonUI/MenuIcon';
import Feedback from '../components/feedback/Feedback';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import CommonScreens from './CommonScreen';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';

const DetractorStack = createStackNavigator();

const DashboardStack = props => (
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
        headerRight: () => <NotiificationIcon />,
        headerTitleAlign: 'left',
        headerTitleContainerStyle: {
          width: '100%',
          right: 0,
        },
      })}
    />

    {/* <DetractorStack.Screen
        name="Search Ticket"
        component={SearchTicket}
        options={({navigation, route}) => ({
          headerShown: false,
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        })}
      /> */}

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
        headerRight: () => <NotiificationIcon />,
        headerTitleAlign: 'left',
        headerShown: true,
        headerTitleContainerStyle: {
          width: '100%',
          right: 0,
        },
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
              screenName={'Closedloop'}
              navigation={navigation}
            />
          );
        },
        headerRight: () => <NotiificationIcon />,
        headerTitleAlign: 'left',
        headerShown: true,
        headerTitleContainerStyle: {
          width: '100%',
          right: 0,
        },
      })}
    />
    {CommonScreens(DetractorStack)}
  </DetractorStack.Navigator>
);

const DashboardModalStack = () => (
  <DetractorStack.Navigator screenOptions={{presentation: 'modal'}}>
    <DetractorStack.Screen
      name="DashboardMain"
      component={DashboardStack}
      options={({navigation, route}) => ({headerShown: false})}
    />

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

export default DashboardModalStack;
