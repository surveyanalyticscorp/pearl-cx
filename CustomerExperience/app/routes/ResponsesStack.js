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

const FeedbackStack = createStackNavigator();

const feedbackStack = props => (
  <FeedbackStack.Navigator>
    <FeedbackStack.Screen
      name={translate('responses.responses')}
      component={Feedback}
      options={({navigation, route}) => ({
        headerLeft: props => <MenuIcon />,
        headerTitle: props => (
          <SegmentSelector
            prevScreenName={translate('responses.responses')}
            screenName={translate('responses.responses')}
          />
        ),
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
        // headerRight: (props) => <SearchIcon route={'Feedback'} />,
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
  </FeedbackStack.Navigator>
);

export default ResponsesStack;
