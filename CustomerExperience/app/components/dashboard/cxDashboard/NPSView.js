import React from 'react';
import {StyleSheet, View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import NpsGaugeChart from '../../../widgets/dashboardWidget/NpsGaugeChart';
import GapView from './NPSScoreView';
import GoalView from './BenchmarkView';
import ChartLegendView from './ChartLegendView';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';

const GapAndGoalView = ({children}) => {
  return <View style={styles.gapAndGoalContainer}>{children}</View>;
};

const NPSView = () => {
  return (
    <View style={dashboardStyles.npsViewContainer}>
      <NpsGaugeChart />
      {/* <NPSCountView /> */}
      <GapAndGoalView>
        <GoalView />
        <GapView />
      </GapAndGoalView>

      <ChartLegendView />
    </View>
  );
};
export default NPSView;

const styles = StyleSheet.create({
  gapAndGoalContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 20,
  },
});
