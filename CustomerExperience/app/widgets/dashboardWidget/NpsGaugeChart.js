import React from 'react';
// import AMCharts from 'react-native-amcharts';
import AMCharts from '../AMChart';
import {StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {useSelector} from 'react-redux';
import {generatedAxisRanges} from '../../Utils/NPSChartUtils';
import {TextSizes} from '../../styles/textsize.constants';

const NpsGaugeChart = () => {
  const {
    totalResponses,
    promoterPercent,
    passivePercent,
    detractorPercent,
    npsPercentage,
    benchmarkScore,
  } = useSelector(state => state.dashboard.currentNPSData?.NPSScore);

  const chartType = 'GaugeChart';

  const axisRanges = generatedAxisRanges(
    (totalResponses ?? 0) > 0
      ? [
          {value: detractorPercent, fillColor: Colors.detractor2},
          {value: passivePercent, fillColor: Colors.passive2},
          {value: promoterPercent, fillColor: Colors.promoter2},
        ]
      : [{value: 0, fillColor: Colors.darkGrey}],
  );
  const populateHands = (nps, benchmark) => {
    let hands = [];
    if (benchmark !== 0) {
      hands.push({
        type: 'ClockHand',
        value: benchmark,
        fill: Colors.borderColor,
        stroke: Colors.borderColor,
        innerRadius: '00%',
        radius: '100%',
        startWidth: 0.01,
        endWidth: 0.01,
        pin: {
          disabled: false,
        },
      });
    }

    hands.push({
      type: 'ClockHand',
      value: nps,
      fill: Colors.filterIconColor,
      stroke: Colors.filterIconColor,
      innerRadius: '00%',
      radius: '100%',
      startWidth: 10,
      endWidth: 0.1,
      pin: {
        disabled: false,
      },
    });

    return hands;
  };

  const guage_ = {
    // Set inner radius
    innerRadius: -40,
    bottomText: 'Bottom',
    // Create axis
    xAxes: [
      {
        type: 'ValueAxis',
        min: -100,
        max: 100,
        strictMinMax: true,
        renderer: {
          minGridDistance: 200,
          inside: false,
          labels: {
            template: {
              fontFamily: 'Fira Sans, Arial, Helvetica, sans-serif', // Fallback fonts
              fontSize: TextSizes.extraLargeText,
              fontWeight: 'bold',
              // color: Colors.accentLight,
              fill: Colors.filterIconColor,
            },
          },
        },
        // Add ranges
        axisRanges: axisRanges,
      },
    ],

    // Add hands
    hands: populateHands(npsPercentage, benchmarkScore),
  };

  return (
    <AMCharts
      config={guage_}
      type={chartType}
      style={styles.chartContainer}
      initialScale={0.6}
    />
  );
};

const styles = StyleSheet.create({
  chartContainer: {
    zIndex: 0,
    height: '50%',
    width: '70%',
    margin: 0,
  },
});

export default NpsGaugeChart;
