import React from 'react';
import {View} from 'react-native';
import QPSpinner from '../../widgets/QPSpinner';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';

export const RenderSpinner = () => {
  return (
    <View style={dashboardStyles.loading}>
      <QPSpinner />
    </View>
  );
};
