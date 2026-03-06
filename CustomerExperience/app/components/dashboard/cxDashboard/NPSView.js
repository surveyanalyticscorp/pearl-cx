import React from 'react';
import {StyleSheet, View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import NpsGaugeChart from '../../../widgets/dashboardWidget/NpsGaugeChart';
import GapView from './NPSScoreView';
import GoalView from './BenchmarkView';
import ChartLegendView from './ChartLegendView';
import {useSelector} from 'react-redux';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {MarginConstants} from '../../../styles/margin.constants';
import StringUtils from '../../../Utils/StringUtils';

const GapAndGoalView = ({children}) => {
  return <View style={styles.gapAndGoalContainer}>{children}</View>;
};

const NPSCountView = () => {
  const {npsPercentage} = useSelector(
    state => state.dashboard?.currentNPSData?.NPSScore,
  );
  return (
    <View style={dashboardStyles.npsCountContainer}>
      <TextLabel
        text={`${StringUtils.floatTo2DecimalPoint(npsPercentage ?? 0)}%`}
        style={dashboardStyles.npsPercentText}
      />
      <TextLabel text={'NPS'} style={dashboardStyles.npsText} />
    </View>
  );
};
const NPSView = () => {
  return (
    <View style={dashboardStyles.npsViewContainer}>
      <NpsGaugeChart />
      <NPSCountView />
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
    marginVertical: MarginConstants.halfTab,
  },
});
