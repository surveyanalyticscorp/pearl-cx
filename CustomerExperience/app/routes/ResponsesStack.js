import FeedbackSorter from '../components/feedback/FeedbackSorter';
import {View} from 'react-native';
// import CreateTicket from '../components/dashboard/components/CreateTicket';
// import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feedback from '../components/feedback/Feedback';
import SearchFeedback from '../components/feedback/SearchFeedback';
import CommonScreens from './CommonScreen';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import MenuIcon from './commonUI/MenuIcon';
import {translate} from '../Utils/MultilinguaUtils';
import SegmentSelector from '../components/SegmentSelector';
import TicketDetails from '../components/closedloop/TicketDetails';
import {TransitionPresets} from '@react-navigation/stack';

const FeedbackStackNavigator = createStackNavigator();

const FeedbackStack = props => (
  <FeedbackStackNavigator.Navigator>
    <FeedbackStackNavigator.Screen
      name={translate('responses.responses')}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: props => <MenuIcon />,
        headerTitle: props => (
          <SegmentSelector screenName={translate('responses.responses')} />
        ),
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
      })}
    />
    <FeedbackStackNavigator.Screen
      name="Search Response"
      component={SearchFeedback}
      options={({navigation, route}) => ({
        headerShown: false,
        headerLeft: props => <HeaderBackLeft {...props} route={route} />,
      })}
    />

    {CommonScreens(FeedbackStackNavigator)}
  </FeedbackStackNavigator.Navigator>
);

const ResponsesStack = ({navigation}) => (
  <FeedbackStackNavigator.Navigator screenOptions={{presentation: 'modal'}}>
    <FeedbackStackNavigator.Screen
      name="Responses"
      component={FeedbackStack}
      options={({navigation, route}) => ({headerShown: false})}
    />
    <FeedbackStackNavigator.Screen
      name={translate('responses.sort_by')}
      component={FeedbackSorter}
      options={({navigation, route}) => ({
        // headerLeft: (props) => <View />,
        // headerRight: (props) => <CloseButton />,
        headerShown: false,
        // gestureDirection: 'vertical',
        gestureEnabled: true,
        ...TransitionPresets.ModalPresentationIOS,
        // transitionSpec: {
        //   open: TransitionSpecs.FadeInFromBottomAndroidSpec,
        //   close: TransitionSpecs.TransitionIOSSpec,
        // },
      })}
    />
  </FeedbackStackNavigator.Navigator>
);

export default ResponsesStack;
