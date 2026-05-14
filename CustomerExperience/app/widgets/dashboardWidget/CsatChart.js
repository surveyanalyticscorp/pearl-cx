import React from 'react';
import {useSelector} from 'react-redux';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {VictoryPie} from 'victory-native';
import SmileyImageLabel from './SmileyImageLabel';
import {StyleSheet, View} from 'react-native';
import CsatPositiveIcon from '../../../assets/images/csat_positive.svg';
import CsatNeutralIcon from '../../../assets/images/csat_neutral.svg';
import CsatNegativeIcon from '../../../assets/images/csat_negative.svg';

export function getCsatData(positive, neutral, negative) {
  return [
    {y: positive, x: 'positive', SvgComponent: CsatPositiveIcon},
    {y: neutral, x: 'neutral', SvgComponent: CsatNeutralIcon},
    {y: negative, x: 'negative', SvgComponent: CsatNegativeIcon},
  ];
}

const CsatChart = () => {
  const {promoterPercent, passivePercent, detractorPercent} = useSelector(
    state => state.dashboard.currentNPSData.NPSScore,
  );

  const victoryPieColorScale = [
    Colors.promoter3,
    Colors.passive3,
    Colors.detractor3,
  ];

  return (
    <View style={styles.container}>
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

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default CsatChart;
