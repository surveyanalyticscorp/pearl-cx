import React from 'react';
import {Text} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import StringUtils from '../../Utils/StringUtils';
const CsatScoreLabel = () => {
  const {csatScore, csatMeanAverage} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );
  const {isCsatViewTopBox} = useSelector(state => state.dashboard);

  return (
    <Text style={dashboardStyles.csatScoreLabel}>
      {isCsatViewTopBox
        ? `${StringUtils.floatTo2DecimalPointString(csatMeanAverage)}`
        : `${StringUtils.floatTo2DecimalPointString(csatScore)}%`}
    </Text>
  );
};

export default CsatScoreLabel;
