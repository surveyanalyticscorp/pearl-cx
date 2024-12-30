import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import CsatChart from '../../../widgets/dashboardWidget/CsatChart';
import CsatScoreLabel from '../../../widgets/dashboardWidget/CsatScoreLabel';
import CsatToggleButton from '../../../widgets/dashboardWidget/CsatToggleButton';
import ChartLegendView from './ChartLegendView';

const RenderCSATChart = () => {
  const NPSScore = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );
  return NPSScore ? (
    <View style={dashboardStyles.csatContainer}>
      <CsatChart />
      <CsatScoreLabel />
      <CsatToggleButton />
      <ChartLegendView />
    </View>
  ) : (
    <View />
  );
};

export default RenderCSATChart;
