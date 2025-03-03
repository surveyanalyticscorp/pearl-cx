import React from 'react';
import {View} from 'react-native';
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

  const responseCount = StringUtils.getTrimmedNoOfResponses(responses);
  const responseIcon = require('./../../../assets/images/total_responses_icon.png');

  return (
    <View
      testID="render-info-container"
      style={dashboardStyles.renderInfoContainer}>
      <RenderInfo
        icon={responseIcon}
        title={translate('dashboard.responses')}
        count={responseCount}
      />
    </View>
  );
};

export default RenderInfoContainer;
