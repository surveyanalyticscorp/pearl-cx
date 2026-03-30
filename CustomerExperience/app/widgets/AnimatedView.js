import React from 'react';
import {Animated} from 'react-native';
import {dashboardStyles} from '../components/dashboard/dashboard.style';

const AnimatedView = ({fall, children}) => {
  return (
    <Animated.View
      testID="animated-view"
      style={[
        dashboardStyles.container,
        {
          opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
        },
      ]}>
      {children}
    </Animated.View>
  );
};

export default AnimatedView;
