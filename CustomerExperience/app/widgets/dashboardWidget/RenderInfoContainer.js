import React from 'react';
import {View, StyleSheet} from 'react-native';
import {useSelector} from 'react-redux';
import {getTrimmedNoOfResponses} from '../../Utils/TicketUtils';
import {translate} from '../../Utils/MultilinguaUtils';
import RenderInfo from './RenderInfo';
import style from '../qp-calendar/calendar/header/style';
import {dashboardStyles} from '../../components/dashboard/dashboard.style';

const RenderInfoContainer = () => {
  const responses = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore?.totalResponses,
  );
  const surveyCount = useSelector(
    state => state.dashboard.dashboardData.surveyCount,
  );
  const responseCount = getTrimmedNoOfResponses(responses);
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
