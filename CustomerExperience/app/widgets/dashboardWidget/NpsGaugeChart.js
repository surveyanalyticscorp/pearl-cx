import React from 'react';
// import AMCharts from 'react-native-amcharts';
import AMCharts from '../AMChart';
import {StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {useSelector} from 'react-redux';
import {generatedAxisRanges} from '../../Utils/NPSChartUtils';
import {TextSizes} from '../../styles/textsize.constants';

export const populateHands = (nps, benchmark) => {
  let hands = [];

  // Create dotted line effect for benchmark using multiple small segments
  const segments = [
    {start: '10%', end: '20%'},
    {start: '30%', end: '40%'},
    {start: '50%', end: '60%'},
    {start: '70%', end: '80%'},
    {start: '90%', end: '98%'},
  ];

  // Add each segment as a separate hand to create dotted effect
  segments.forEach(segment => {
    hands.push({
      type: 'ClockHand',
      value: benchmark,
      fill: Colors.filterIconColor,
      stroke: Colors.filterIconColor,
      innerRadius: segment.start,
      radius: segment.end,
      startWidth: 3,
      endWidth: 3,
      pin: {
        disabled: true,
      },
    });
  });

  // Main NPS hand
  hands.push({
    type: 'ClockHand',
    value: nps,
    fill: Colors.filterIconColor,
    stroke: Colors.filterIconColor,
    innerRadius: '00%',
    radius: '95%',
    startWidth: 10,
    endWidth: 0.1,
    pin: {
      disabled: false,
    },
  });

  return hands;
};

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
          {value: detractorPercent, fillColor: Colors.detractor3},
          {value: passivePercent, fillColor: Colors.passive3},
          {value: promoterPercent, fillColor: Colors.promoter3},
        ]
      : [{value: 0, fillColor: Colors.darkGrey}],
  );

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
          minGridDistance: 500,
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
    height: '40%',
    width: '100%',
    margin: 1,
    alignSelf: 'center',
  },
});

export default NpsGaugeChart;
