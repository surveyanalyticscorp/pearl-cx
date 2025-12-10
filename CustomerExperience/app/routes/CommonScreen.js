import {Dimensions, View, Alert, BackHandler} from 'react-native';
import FeedbackDetails from '../components/feedback/FeedbackDetails';

import UpdateTicket from '../components/dashboard/ticketManagement/UpdateTicket';
import React from 'react';
import {Colors} from '../styles/color.constants';
import {TextSizes} from '../styles/textsize.constants';
import {textStyles} from '../styles/text.styles';
import {PaddingConstants} from '../styles/padding.constants';
import DashboardDateFilter from '../components/dashboard/components/DashboardDateFilter';
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import {TransitionPresets} from '@react-navigation/stack';
import TicketOverview from '../components/dashboard/ticketManagement/TicketOverview';
import TicketComments from '../components/dashboard/ticketManagement/TicketComments';
import DetractorScenes from '../components/dashboard/components/DetractorScenes';
import {translate} from '../Utils/MultilinguaUtils';
import SelectSegmentScreen from '../components/SelectSegmentScreen';

import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import TicketDetails from '../components/closedloop/TicketDetails';
import TicketTakeAction from '../components/closedloop/takeaction/TIcketTakeAction';
import FeedbackSorter from '../components/feedback/FeedbackSorter';
import SelectEmailTemplate from '../components/closedloop/takeaction/SelectEmailTemplate';
import SendEmail from '../components/closedloop/takeaction/SendEmail';
import ActionEmailHistory from '../components/closedloop/takeaction/ActionEmailHistory';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import {CloseButton} from './commonUI/CommonUI';
import PushNotification from '../components/notifications/PushNotifications';
import {CentralizedRootCause} from '../components/closedloop/TicketRootCause/CentralizedRootCause/CentralizedRootCause';
import {OldRootCause} from '../components/closedloop/TicketRootCause/OldRootCause';
import FilterTicket from '../components/closedloop/takeaction/FilterTickets';
import AiTagsFilter from '../components/closedloop/takeaction/AiTagsFilter';

const DateRangeTab = createMaterialTopTabNavigator();
const TicketLogTab = createMaterialTopTabNavigator();
const CloseLoopTicketsTab = createMaterialTopTabNavigator();

let {width} = Dimensions.get('window');

export const RenderExitAlert = props => {
  return Alert.alert(
    translate('exit_app'),
    translate('exit_message'),
    [
      {
        text: translate('yes'),
        onPress: () => {
          props.showExitAlert(false);
          BackHandler.exitApp();
        },
      },
      {
        text: translate('no'),
        onPress: () => {
          props.showExitAlert(false);
        },
      },
    ],
    {cancelable: false},
  );
};

export const CloseLoopTicketsTabs = props => (
  <CloseLoopTicketsTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.secondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.new')}
      component={DetractorScenes}
      initialParams={{dataCount: 0}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.open')}
      component={DetractorScenes}
      initialParams={{dataCount: 1}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.escalated')}
      component={DetractorScenes}
      initialParams={{dataCount: 3}}
    />
    <CloseLoopTicketsTab.Screen
      name={translate('dashboard.resolved')}
      component={DetractorScenes}
      initialParams={{dataCount: 2}}
    />
  </CloseLoopTicketsTab.Navigator>
);

export const DateRangeTabStack = props => (
  <DateRangeTab.Navigator
    tabBarOptions={{
      labelStyle: {
        color: Colors.primary,
        width: width / 2,
        fontSize: TextSizes.primary,
        textTransform: 'none',
      },

      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.3 * PaddingConstants.tab4},
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <DateRangeTab.Screen
      name={translate('date_filter.month')}
      component={DashboardDateFilter}
    />
    <DateRangeTab.Screen
      name={translate('date_filter.custom')}
      component={DashboardDateFilter}
    />
  </DateRangeTab.Navigator>
);

export const TicketLogTabStack = props => (
  <TicketLogTab.Navigator
    tabBarOptions={{
      labelStyle: {width: width / 3, fontSize: TextSizes.semiSecondary},
      indicatorStyle: {backgroundColor: Colors.accent},
      style: {backgroundColor: Colors.white, width: '100%'},
      initialLayout: {width: Dimensions.get('window').width},
      tabStyle: {height: 1.5 * PaddingConstants.tab4},
      activeTintColor: Colors.accent,
      inactiveTintColor: Colors.primary,
    }}
    lazy
    keyboardDismissMode={'auto'}>
    <TicketLogTab.Screen
      name={translate('close_loop.overview')}
      component={TicketOverview}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.comments')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
    <TicketLogTab.Screen
      name={translate('close_loop.logs')}
      component={TicketComments}
      initialParams={{
        ticketID: props.route.params.ticketID,
        parentRoute: props.route.params.parentRoute,
      }}
    />
  </TicketLogTab.Navigator>
);

const CommonScreens = RootStack => {
  return [
    <RootStack.Screen
      key={'Date Range'}
      name={translate('date_filter.date_range')}
      component={DateRangeTabStack}
      // component={DashboardDateFilter}
      options={({navigation, route}) => ({
        headerShown: false,
        // gestureDirection: 'vertical',
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        // headerLeft: props => <HeaderBackLeft />,
        // headerRight: props => <SaveDashboardDate {...props} route={route} />,
      })}
    />,

    // <RootStack.Screen
    //   key={'TicketFilter'}
    //   name={translate('filter_by') ?? 'Filter by'}
    //   component={FilterTicket}
    //   // component={DashboardDateFilter}
    //   options={({navigation, route}) => ({
    //     headerShown: true,
    //     gestureEnabled: false,
    //     ...TransitionPresets.ModalPresentationIOS,
    //   })}
    // />,

    // AiTagsFilter

    <RootStack.Screen
      key={'TicketFilter'}
      name={'TicketFilter'}
      component={FilterTicket}
      options={({navigation, route}) => ({
        headerShown: false,
        gestureEnabled: true,
        title: translate('filter_by') ?? 'Filter by',
        headerTitleStyle: textStyles.headerTitleStyle,
        ...TransitionPresets.ModalPresentationIOS,

        // headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        // headerRight: props => <View />,
      })}
    />,

    <RootStack.Screen
      key={'AiTagsFilter'}
      name={'AiTagsFilter'}
      component={AiTagsFilter}
      options={({navigation, route}) => ({
        headerShown: false,
        gestureEnabled: true,
        title: 'AI Tags',
        headerTitleStyle: textStyles.headerTitleStyle,
        ...TransitionPresets.ModalPresentationIOS,

        // headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        // headerRight: props => <View />,
      })}
    />,

    <RootStack.Screen
      key={'OldRootCause'}
      name={'OldRootCause'}
      component={OldRootCause}
      options={({navigation, route}) => ({
        // headerShown: false,
        title: 'Old Root Cause',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        headerRight: props => <View />,
        // headerRight: (props) => <EditTicket {...props} route={route} />,
        // headerLeft: (props) => <MenuIcon />,
      })}
    />,
    <RootStack.Screen
      key={'CentralizedRootCause'}
      name={'CentralizedRootCause'}
      component={CentralizedRootCause}
      options={({navigation, route}) => ({
        // headerShown: false,
        title: 'Centralized Root Cause',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        headerRight: props => <View />,
        // headerRight: (props) => <EditTicket {...props} route={route} />,
        // headerLeft: (props) => <MenuIcon />,
      })}
    />,

    <RootStack.Screen
      key={'TicketDetails'}
      name={'TicketDetails'}
      component={TicketDetails}
      options={({navigation, route}) => ({
        // headerShown: false,
        title: 'Ticket Details',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        headerRight: props => <View />,
        // headerRight: (props) => <EditTicket {...props} route={route} />,
        // headerLeft: (props) => <MenuIcon />,
      })}
    />,

    <RootStack.Screen
      name={translate('responses.feedback_details')}
      key={'Feedback Details'}
      component={FeedbackDetails}
      options={({navigation, route}) => ({
        title: translate('close_loop.view_response'),
        headerTitleStyle: textStyles.headerTitleStyle,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={'Update Ticket'}
      name={translate('close_loop.update_ticket')}
      component={UpdateTicket}
      options={({navigation, route}) => ({
        headerTitleStyle: textStyles.headerTitleStyle,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />,

    <RootStack.Screen
      key={translate('dashboard.segment')}
      name={translate('dashboard.segment')}
      component={SelectSegmentScreen}
      options={({navigation, route}) => ({
        headerShown: false,
        // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
    <RootStack.Screen
      key={translate('responses.new_ticket')}
      name={translate('responses.new_ticket')}
      component={CreateTicket}
      options={({navigation, route}) => ({
        // headerLeft: (props) => <View />,
        // headerRight: (props) => <CloseButton />,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
        headerShown: true,
        title: 'New ticket',
        headerTitleStyle: textStyles.headerTitleStyle,
        // gestureDirection: 'vertical',
        // gestureEnabled: true,
        // ...TransitionPresets.ModalPresentationIOS,
        // transitionSpec: {
        //   open: TransitionSpecs.FadeInFromBottomAndroidSpec,
        //   close: TransitionSpecs.TransitionIOSSpec,
        // },
      })}
    />,

    ///// closed loop things

    <RootStack.Screen
      key={'TicketTakeAction'}
      name={'TicketTakeAction'}
      component={TicketTakeAction}
      options={({navigation, route}) => ({
        title: 'Take action',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerShown: false,
        // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
        // headerRight: (props) => <EditTicket {...props} route={route} />,
        // headerLeft: (props) => <MenuIcon />,
      })}
    />,
    <RootStack.Screen
      key={translate('responses.sort_by')}
      name={translate('responses.sort_by')}
      component={FeedbackSorter}
      options={({navigation, route}) => ({
        headerLeft: props => <View />,
        headerRight: props => <CloseButton />,
      })}
    />,

    <RootStack.Screen
      key={'SelectEmailTemplate'}
      name={'SelectEmailTemplate'}
      component={SelectEmailTemplate}
      options={({navigation, route}) => ({
        title: 'Select template',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerShown: false,
      })}
    />,
    <RootStack.Screen
      key={'sendEmail'}
      name={'sendEmail'}
      component={SendEmail}
      options={({navigation, route}) => ({
        title: 'Send email',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerShown: false,
      })}
    />,

    <RootStack.Screen
      key={'actionEmailHistory'}
      name={'actionEmailHistory'}
      component={ActionEmailHistory}
      options={({navigation, route}) => ({
        title: 'Action email history',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerShown: false,
      })}
    />,

    <RootStack.Screen
      key={'notifications'}
      name={'notifications'}
      component={PushNotification}
      options={({navigation, route}) => ({
        title: 'Notifications',
        headerTitleStyle: textStyles.headerTitleStyle,
        headerShown: true,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />,
  ];
};
export default CommonScreens;
