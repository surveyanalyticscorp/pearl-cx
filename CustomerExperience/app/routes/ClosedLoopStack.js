import FeedbackSorter from '../components/feedback/FeedbackSorter';
import {StyleSheet, View} from 'react-native';
import CreateTicket from '../components/dashboard/components/CreateTicket';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feedback from '../components/feedback/Feedback';
import SearchFeedback from '../components/feedback/SearchFeedback';
import CommonScreens, {
  CloseButton,
  EditTicket,
  HeaderBackLeft,
  MenuIcon,
  SearchIcon,
} from './CommonScreen';
import {translate} from '../Utils/MultilinguaUtils';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import TicketDetails from '../components/closedloop/TicketDetails';

const FeedbackStack = createStackNavigator();

const feedbackStack = (props) => (
  <FeedbackStack.Navigator>
    <FeedbackStack.Screen
      // name={translate('responses.responses')}

      name={translate('dashboard.tickets')}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: (props) => <MenuIcon />,
        headerRight: (props) => <SearchIcon route={'Feedback'} />,
      })}
    />
    <FeedbackStack.Screen
      name="Search Response"
      component={SearchFeedback}
      options={({navigation, route}) => ({
        headerShown: false,
        headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
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
          // headerShown: false,
          // headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          headerLeft: (props) => <MenuIcon />,
        })}
      />

      <FeedbackStack.Screen
        name={'Ticket 9033212'}
        component={TicketDetails}
        options={({navigation, route}) => ({
          // headerShown: false,
          headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          headerRight: (props) => <EditTicket {...props} route={route} />,
          // headerLeft: (props) => <MenuIcon />,
        })}
      />

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
