import {View} from 'react-native';
import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import Feedback from '../components/feedback/Feedback';
import CommonScreens, {SearchIcon} from './CommonScreen';
import MenuIcon from './commonUI/MenuIcon';
import {translate} from '../Utils/MultilinguaUtils';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import SegmentSelector from '../components/SegmentSelector';

const FeedbackStack = createStackNavigator();

// const feedbackStack = props => (
//   <FeedbackStack.Navigator>
//     <FeedbackStack.Screen
//       // name={translate('responses.responses')}

//       name={translate('dashboard.tickets')}
//       component={Feedback}
//       options={({navigation, route}) => ({
//         headerLeft: props => <MenuIcon />,
//         headerRight: props => <SearchIcon route={'Feedback'} />,
//       })}
//     />

//     {CommonScreens(FeedbackStack)}
//   </FeedbackStack.Navigator>
// );

const ClosedLoopStack = ({navigation}) => {
  return (
    <FeedbackStack.Navigator mode="modal" testID="closed-loop-stack">
      <FeedbackStack.Screen
        name="Closedloop"
        component={ClosedLoop}
        options={({navigation, route}) => ({
          headerTitle: props => (
            <SegmentSelector
              testID="segment-selector"
              screenName={'Closedloop'}
            />
          ),

          headerLeft: props => <MenuIcon testID="menu-icon" />,
        })}
      />
      {CommonScreens(FeedbackStack)}
    </FeedbackStack.Navigator>
  );
};

export default ClosedLoopStack;
