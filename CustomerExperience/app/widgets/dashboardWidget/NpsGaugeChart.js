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
    promoterPercent,
    passivePercent,
    detractorPercent,
    npsPercentage,
    benchmarkScore,
  } = useSelector(state => state.dashboard.currentNPSData?.NPSScore);
  // console.log('Gauge', npsPercentage, benchmarkScore);

  const chartType = 'GaugeChart';

  const axisRanges = generatedAxisRanges([
    {value: detractorPercent, fillColor: Colors.detractor2},
    {value: passivePercent, fillColor: Colors.passive2},
    {value: promoterPercent, fillColor: Colors.promoter2},
  ]);

  const guage_ = {
    // Set inner radius
    innerRadius: -30,
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
              fontSize: TextSizes.primary,
              // "font-weight": "bold",
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
    hands: [
      {
        type: 'ClockHand',
        value: benchmarkScore,
        fill: Colors.borderColor,
        stroke: Colors.borderColor,
        innerRadius: '00%',
        radius: '100%',
        startWidth: 0.01,
        endWidth: 0.01,
        pin: {
          disabled: true,
        },
      },
      {
        type: 'ClockHand',
        value: npsPercentage,
        fill: Colors.filterIconColor,
        stroke: Colors.filterIconColor,
        innerRadius: '00%',
        radius: '85%',
        startWidth: 10,
        endWidth: 0.1,
        pin: {
          disabled: false,
        },
      },
    ],
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
    height: '60%',
    width: '80%',
    margin: 0,
  },
});

export default NpsGaugeChart;
