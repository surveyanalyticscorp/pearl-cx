import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import CommonScreens from './CommonScreen';
import MenuIcon from './commonUI/MenuIcon';
import ClosedLoop from '../components/closedloop/ClosedLoop';
import SegmentSelector, {
  NotiificationIcon,
} from '../components/SegmentSelector';

const FeedbackStack = createStackNavigator();

const ClosedLoopStack = ({navigation}) => {
  return (
    <FeedbackStack.Navigator
      screenOptions={{presentation: 'modal'}}
      testID="closed-loop-stack">
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
          headerRight: () => <NotiificationIcon />,
          headerTitleAlign: 'left',
          headerTitleContainerStyle: {
            width: '100%',
          },
        })}
      />
      {CommonScreens(FeedbackStack)}
    </FeedbackStack.Navigator>
  );
};

export default ClosedLoopStack;
