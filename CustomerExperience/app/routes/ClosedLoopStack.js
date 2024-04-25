// import FeedbackSorter from '../components/feedback/FeedbackSorter';
import {
  // StyleSheet,
  View,
} from 'react-native';
// import CreateTicket from '../components/dashboard/components/CreateTicket';
import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feedback from '../components/feedback/Feedback';
import SearchFeedback from '../components/feedback/SearchFeedback';
import CommonScreens, {
  CloseButton,
  DateRangeTabStack,
  // CloseButton,
  // EditTicket,
  HeaderBackLeft,
  MenuIcon,
  SaveDashboardDate,
  SearchIcon,
} from './CommonScreen';
import {translate} from '../Utils/MultilinguaUtils';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import TicketDetails from '../components/closedloop/TicketDetails';
import TicketTakeAction from '../components/closedloop/takeaction/TIcketTakeAction';
import SelectEmailTemplate from '../components/closedloop/takeaction/SelectEmailTemplate';
import SendEmail from '../components/closedloop/takeaction/SendEmail';
import FeedbackSorter from '../components/feedback/FeedbackSorter';
import SegmentSelector from '../components/SegmentSelector';
import ActionEmailHistory from '../components/closedloop/takeaction/ActionEmailHistory';

const FeedbackStack = createStackNavigator();

const feedbackStack = props => (
  <FeedbackStack.Navigator>
    <FeedbackStack.Screen
      // name={translate('responses.responses')}

      name={translate('dashboard.tickets')}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: props => <MenuIcon />,
        headerRight: props => <SearchIcon route={'Feedback'} />,
      })}
    />
    <FeedbackStack.Screen
      name="Search Response"
      component={SearchFeedback}
      options={({navigation, route}) => ({
        headerShown: false,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />
    {CommonScreens(FeedbackStack)}
  </FeedbackStack.Navigator>
);

const ClosedLoopStack = ({navigation}) => {
  return (
    <FeedbackStack.Navigator mode="modal">
      <FeedbackStack.Screen
        name="Closed Loop"
        component={ClosedLoop}
        options={({navigation, route}) => ({
          headerTitle: props => <SegmentSelector screenName={'Closedloop'} />,
          // headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          headerLeft: props => <MenuIcon />,
        })}
      />
      {/* <FeedbackStack.Screen
        name={'TicketDetails'}
        component={TicketDetails}
        options={({navigation, route}) => ({
          // headerShown: false,
          title: 'Ticket Details',
          headerLeft: props => <HeaderBackLeft {...props} route={route} />,
          headerRight: props => <View />,
          // headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={'TicketTakeAction'}
        component={TicketTakeAction}
        options={({navigation, route}) => ({
          title: 'Take action ',
          headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          // headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={translate('responses.sort_by')}
        component={FeedbackSorter}
        options={({navigation, route}) => ({
          headerLeft: props => <View />,
          headerRight: props => <CloseButton />,
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={translate('responses.new_ticket')}
        component={CreateTicket}
        options={({navigation, route}) => ({
          headerShown: false,
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={'SelectEmailTemplate'}
        component={SelectEmailTemplate}
        options={({navigation, route}) => ({
          title: 'Select template',
          headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          // headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={'sendEmail'}
        component={SendEmail}
        options={({navigation, route}) => ({
          title: 'Send email',
          headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          // headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      /> */}

      {/* <FeedbackStack.Screen
        name={'actionEmailHistory'}
        component={ActionEmailHistory}
        options={({navigation, route}) => ({
          title: 'Action email history',
          headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          // headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      /> */}
      {CommonScreens(FeedbackStack)}
      {/* <FeedbackStack.Screen
        key={'Date Range'}
        name={translate('date_filter.date_range')}
        component={DateRangeTabStack}
        options={({navigation, route}) => ({
          headerLeft: (props) => <HeaderBackLeft />,
          headerRight: (props) => (
            <SaveDashboardDate {...props} route={route} />
          ),
        })}
      /> */}
      {/* <FeedbackStack.Screen
        name={translate('responses.sort_by')}
        component={FeedbackSorter}
        options={({navigation, route}) => ({
          headerLeft: (props) => <View />,
          headerRight: (props) => <CloseButton />,
        })}
      />
      <FeedbackStack.Screen
        name={translate('responses.new_ticket')}
        component={CreateTicket}
        options={({navigation, route}) => ({
          headerLeft: (props) => <View />,
          headerRight: (props) => <CloseButton />,
        })}
      /> */}
    </FeedbackStack.Navigator>
  );
};

export default ClosedLoopStack;
