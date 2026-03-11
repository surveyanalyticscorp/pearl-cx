import React from 'react';
import {View} from 'react-native';
import {dashboardStyles} from '../dashboard.style';
import {useSelector} from 'react-redux';
import DashboardSegmentHeader from '../../../widgets/dashboardWidget/RenderSegmentTitle';
import ResponsesButton from '../../../widgets/dashboardWidget/ResponsesButton';
import RenderCSATChart from './RenderCsatChart';
import RenderNPSChart from './RenderNPSChart';

const RenderSegmentDashboardData = () => {
  const {scoringModel, primaryStoreName} = useSelector(
    state => state.dashboard?.dashboardData,
  );

  const currentSegmentName = useSelector(
    state => state.dashboard?.currentSegment?.currentSegment,
  );

  const title = `${currentSegmentName ?? primaryStoreName} ${
    scoringModel === 1 ? 'CSAT' : 'NPS'
  }`;
  return (
    <View
      style={
        scoringModel === 1
          ? dashboardStyles.csatChartContainer
          : dashboardStyles.chartContainer
      }>
      <DashboardSegmentHeader text={title}>
        <ResponsesButton />
      </DashboardSegmentHeader>
      {/* <RenderInfoContainer /> */}
      {scoringModel && scoringModel === 1 ? (
        <RenderCSATChart />
      ) : (
        <RenderNPSChart />
      )}
    </View>
  );
};

export default RenderSegmentDashboardData;
