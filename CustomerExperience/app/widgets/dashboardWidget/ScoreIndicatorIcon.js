import React from 'react';
import {View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import IndicatorIcon from '../../routes/commonUI/IndicatorIcon';
const ScoreIndicatorIcon = ({diff}) => {
  return diff === 0 ? (
    <View testID="no-view" />
  ) : (
    <IndicatorIcon
      name={diff < 0 ? 'caret-down-sharp' : 'caret-up-sharp'}
      color={diff < 0 ? Colors.detractor2 : Colors.promoter2}
    />
  );
};

export default ScoreIndicatorIcon;
