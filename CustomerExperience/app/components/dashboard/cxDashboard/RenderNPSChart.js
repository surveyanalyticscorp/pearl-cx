import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import NPSView from './NPSView';

const RenderNPSChart = () => {
  const NPSScore = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );

  return (
    <View style={dashboardStyles.renderNpsChartContainer}>
      {NPSScore ? <NPSView /> : <View />}
    </View>
  );
};

export default RenderNPSChart;
