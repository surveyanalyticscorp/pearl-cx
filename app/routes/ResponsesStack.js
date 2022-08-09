import FeedbackSorter from '../components/feedback/FeedbackSorter';
import {StyleSheet, View} from 'react-native';
import CreateTicket from '../components/dashboard/components/CreateTicket';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feedback from '../components/feedback/Feedback';
import SearchFeedback from '../components/feedback/SearchFeedback';
import CommonScreens, {
  CloseButton,
  HeaderBackLeft,
  MenuIcon,
  SearchIcon,
} from './CommonScreen';
import {translate} from '../Utils/MultilinguaUtils';

const FeedbackStack = createStackNavigator();

const feedbackStack = (props) => (
  <FeedbackStack.Navigator>
    <FeedbackStack.Screen
      name={translate('responses.responses')}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: (props) => <MenuIcon />,
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
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

const ResponsesStack = ({navigation}) => (
  <FeedbackStack.Navigator mode="modal">
    <FeedbackStack.Screen
      name="Responses"
      component={feedbackStack}
      options={({navigation, route}) => ({headerShown: false})}
    />
    <FeedbackStack.Screen
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
    />
  </FeedbackStack.Navigator>
);

export default ResponsesStack;
