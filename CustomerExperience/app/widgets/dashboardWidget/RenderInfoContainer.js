import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {translate} from '../../Utils/MultilinguaUtils';
import RenderInfo from './RenderInfo';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';
import StringUtils from '../../Utils/StringUtils';

const RenderInfoContainer = () => {
  const responses =
    useSelector(
      state => state.dashboard.currentNPSData?.NPSScore?.totalResponses,
    ) ?? 0;
  const surveyCount = useSelector(
    state => state.dashboard.dashboardData.surveyCount,
  );
  const responseCount = StringUtils.getTrimmedNoOfResponses(responses);
  const responseIcon = require('./../../../assets/images/total_responses_icon.png');
  const surveyIcon = require('./../../../assets/images/surveys_icon.png');

  return (
    <View style={dashboardStyles.renderInfoContainer}>
      {/* <RenderInfo
          icon={surveyIcon}
          title={translate('dashboard.surveys')}
          count={surveyCount}
        /> */}
      <RenderInfo
        icon={responseIcon}
        title={translate('dashboard.responses')}
        count={responseCount}
      />
      {/* <CsatToggleButton /> */}
    </View>
  );
};

export default RenderInfoContainer;
