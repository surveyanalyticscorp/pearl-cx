import React from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {dashboardStyles} from '../dashboard.style';
import {Colors, getNPSColorByNPS} from '../../../styles/color.constants';
import {FontWeight} from '../../../styles/font.constants';
import StringUtils from '../../../Utils/StringUtils';
import NPSIcon from './NPSIcon';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import ScoreIndicatorIcon from '../../../widgets/dashboardWidget/ScoreIndicatorIcon';
const NpsScoreView = () => {
  const {npsPercentage, benchmarkScore} = useSelector(
    state => state.dashboard?.currentNPSData?.NPSScore,
  );
  const hasBenchmark = benchmarkScore && benchmarkScore !== 0;

  return (
    <View testID="nps-score-view" style={dashboardStyles.squareView}>
      <NPSIcon />
      <TextLabel text={'NPS:'} fontWeight={FontWeight.bold} />
      <TextLabel
        text={StringUtils.floatToDecimal(npsPercentage)}
        fontWeight={FontWeight.bold}
        color={getNPSColorByNPS(npsPercentage)}
      />
      {hasBenchmark ? (
        <TextLabel
          text={`${StringUtils.floatToDecimal(npsPercentage - benchmarkScore)}`}
          baseTextStyle={baseTextStyles.semiSecondaryRegularText}
          color={Colors.evenDarkerGrey}
        />
      ) : (
        <View />
      )}
      {hasBenchmark ? (
        <ScoreIndicatorIcon diff={npsPercentage - benchmarkScore} />
      ) : (
        <View />
      )}
    </View>
  );
};

export default NpsScoreView;
