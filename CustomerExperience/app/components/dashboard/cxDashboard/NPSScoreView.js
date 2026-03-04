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
import {FaIcon} from '../../../Utils/IconUtils';
import {MarginConstants} from '../../../styles/margin.constants';
const GapIcon = ({diff}) => {
  return (
    <FaIcon
      name={diff > 0 ? 'caret-up' : 'caret-down'}
      size={MarginConstants.tab1_2x}
      color={diff > 0 ? Colors.promoter2 : Colors.detractor2}
    />
  );
};

const GapView = () => {
  const {npsPercentage, benchmarkScore} = useSelector(
    state => state.dashboard?.currentNPSData?.NPSScore,
  );
  const hasBenchmark = benchmarkScore && benchmarkScore !== 0;

  return (
    <View testID="nps-score-view" style={dashboardStyles.squareView}>
      {/* <NPSIcon /> */}
      <TextLabel text={'Gap:'} fontWeight={FontWeight.bold} />
      <GapIcon diff={npsPercentage - benchmarkScore} />

      <TextLabel
        text={StringUtils.floatToDecimal(npsPercentage)}
        fontWeight={FontWeight.bold}
        // color={getNPSColorByNPS(npsPercentage)}
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

export default GapView;
