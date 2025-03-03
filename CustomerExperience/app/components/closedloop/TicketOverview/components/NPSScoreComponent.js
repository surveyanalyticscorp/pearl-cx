import React from 'react';
import {View} from 'react-native';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';
import NPSScoreView from '../../../view/NPSScoreView';
import ticketOverviewStyles from '../ticket.overview.style';
import StringUtils from '../../../../Utils/StringUtils';
import {useSelector} from 'react-redux';

const NPSScoreComponent = () => {
  const {npsScore} = useSelector(state => state.dashboard.ticket);

  return !StringUtils.isEmptyOrNull(npsScore) ? (
    <View style={ticketOverviewStyles.rowContainer}>
      <TextLabel text={'NPS:'} style={{flex: 2}} />
      <NPSScoreView text={npsScore} />
    </View>
  ) : (
    <View />
  );
};

export default NPSScoreComponent;
