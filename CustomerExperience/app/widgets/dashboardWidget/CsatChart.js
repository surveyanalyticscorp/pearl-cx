import React from 'react';
import StringUtils from '../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {VictoryPie} from 'victory-native';
import SmileyImageLabel from './SmileyImageLabel';
import {View} from 'react-native';

export function getCsatData(positive, neutral, negative) {
  console.log('positive', StringUtils.floatTo2DecimalPointString(positive));

  return [
    {
      y: positive,
      x: 'positive',
      imageSource: require('../../../assets/images/csat_positive.png'),
    },
    {
      y: neutral,
      x: 'neutral',
      imageSource: require('../../../assets/images/csat_neutral.png'),
    },
    {
      y: negative,
      x: 'negative',
      imageSource: require('../../../assets/images/csat_negative.png'),
    },
  ];
}
const CsatChart = () => {
  const {promoterPercent, passivePercent, detractorPercent} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );

  let victoryPieColorScale = [
    Colors.promoter3,
    Colors.passive3,
    Colors.detractor3,
  ];

  return (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
      }}>
      <VictoryPie
        testID="csat-chart"
        data={getCsatData(promoterPercent, passivePercent, detractorPercent)}
        height={7 * MarginConstants.tab1_8x}
        width={7 * MarginConstants.tab1_8x}
        innerRadius={3.9 * MarginConstants.tab1_4x}
        radius={3.2 * MarginConstants.tab1_4x}
        labelRadius={4.5 * MarginConstants.tab1_4x}
        labelComponent={<SmileyImageLabel />}
        padAngle={2}
        colorScale={victoryPieColorScale}
        endAngle={-90}
        startAngle={90}
      />
    </View>
  );
};

export default CsatChart;
