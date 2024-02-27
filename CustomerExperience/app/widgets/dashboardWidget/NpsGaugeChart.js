import React from 'react';
// import AMCharts from 'react-native-amcharts';
import AMCharts from '../AMChart';
import {StyleSheet} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {useSelector} from 'react-redux';

const NpsGaugeChart = () => {
  const {npsPercentage, benchmarkScore} = useSelector(
    state => state.dashboard.currentNPSData?.NPSScore,
  );
  console.log('Gauge', npsPercentage, benchmarkScore);

  const chartType = 'GaugeChart';

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

        // Add ranges
        axisRanges: [
          {
            value: -100,
            endValue: 0,
            axisFill: {
              fillOpacity: 1,
              fill: Colors.detractor2,
              zIndex: -1,
            },
          },
          {
            value: 0,
            endValue: 50,
            axisFill: {
              fillOpacity: 1,
              fill: Colors.passive2,
              zIndex: -1,
            },
          },
          {
            value: 50,
            endValue: 100,
            axisFill: {
              fillOpacity: 1,
              fill: Colors.promoter2,
              zIndex: -1,
            },
          },
        ],
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
