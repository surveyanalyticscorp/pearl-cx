import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import LegendScoreView from '../../../widgets/dashboardWidget/LegendScoreView';
import {Colors} from '../../../styles/color.constants';

const ChartLegendView = () => {
  const {
    promoters,
    passive,
    detractors,
    promoterPercent,
    passivePercent,
    detractorPercent,
  } = useSelector(state => state.dashboard.currentNPSData?.NPSScore);

  const {scoringModel} = useSelector(state => state.dashboard?.dashboardData);
  return (
    <View
      style={
        scoringModel === 1
          ? dashboardStyles.csatLegendContainer
          : dashboardStyles.npsLegendContainer
      }>
      <LegendScoreView
        title={scoringModel === 1 ? 'Negatives' : 'Detractors'}
        count={detractors}
        percentage={detractorPercent}
        backgroundColor={Colors.detractor3}
      />
      <LegendScoreView
        title={scoringModel === 1 ? 'Neutral' : 'Passive'}
        count={passive}
        percentage={passivePercent}
        backgroundColor={Colors.passive3}
      />
      <LegendScoreView
        title={scoringModel === 1 ? 'Positives' : 'Promoters'}
        count={promoters}
        percentage={promoterPercent}
        backgroundColor={Colors.promoter3}
      />
    </View>
  );
};

export default ChartLegendView;
