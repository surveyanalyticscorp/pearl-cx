import React from 'react';
import {View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import NpsGaugeChart from '../../../widgets/dashboardWidget/NpsGaugeChart';
import NpsScoreView from './NPSScoreView';
import BenchmarkView from './BenchmarkView';
import ChartLegendView from './ChartLegendView';
import ResponseCountView from './ResponeCountView';

const NPSView = () => {
  return (
    <View style={dashboardStyles.npsViewContainer}>
      <NpsGaugeChart />
      <NpsScoreView />
      <BenchmarkView />
      <ChartLegendView />
    </View>
  );
};
export default NPSView;
