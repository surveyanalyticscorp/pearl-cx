import React from 'react';
import StringUtils from '../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {VictoryPie} from 'victory-native';
import SmileyImageLabel from './SmileyImageLabel';

const CsatChart = () => {
  const {promoterPercent, passivePercent, detractorPercent} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );

  function getCsatData(positive, neutral, negative) {
    return [
      {
        y: StringUtils.floatTo2DecimalPointString(positive),
        x: 'positive',
        imageSource: require('../../../assets/images/csat_positive.png'),
      },
      {
        y: StringUtils.floatTo2DecimalPointString(neutral),
        x: 'neutral',
        imageSource: require('../../../assets/images/csat_neutral.png'),
      },
      {
        y: StringUtils.floatTo2DecimalPointString(negative),
        x: 'negative',
        imageSource: require('../../../assets/images/csat_negative.png'),
      },
    ];
  }

  let victoryPieColorScale = [
    Colors.promoter2,
    Colors.passive2,
    Colors.detractor2,
  ];

  return (
    <VictoryPie
      data={getCsatData(promoterPercent, passivePercent, detractorPercent)}
      height={5 * MarginConstants.tab4}
      width={5 * MarginConstants.tab4}
      innerRadius={2.4 * MarginConstants.tab4}
      radius={2.0 * MarginConstants.tab4}
      labelRadius={2.9 * MarginConstants.tab4}
      labelComponent={<SmileyImageLabel />}
      padAngle={2}
      colorScale={victoryPieColorScale}
      endAngle={-90}
      startAngle={90}
    />
  );
};

export default CsatChart;
