import React from 'react';
import {View, Text} from 'react-native';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';

const DashboardWidgetTitle = ({text, child}) => {
  return (
    <View
      testID="render-segment-title"
      style={dashboardStyles.dashboardTitleContainer}>
      <Text
        testID="render-segment-title-text"
        numberOfLines={1}
        ellipsizeMode="tail"
        style={dashboardStyles.dashboardTitle}>
        {text}
      </Text>
      {child}
    </View>
  );
};

export default DashboardWidgetTitle;
