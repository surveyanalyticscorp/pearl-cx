import React from 'react';
// import AMCharts from 'react-native-amcharts';
import AMCharts from '../../widgets/AMChart';
import {Text, StyleSheet} from 'react-native';
import {PaddingConstants} from '../../styles/padding.constants';
import {View} from 'react-native-animatable';
import {MarginConstants} from '../../styles/margin.constants';
import {Colors} from '../../styles/color.constants';

export const GaugeChart = ({npsScore, benchmark}) => {
  console.log('Gauge', npsScore, benchmark);

  const chartType = 'GaugeChart';
  // const chartType = 'PieChart';

  //   const config_ = {
  //     // Create pie series
  //     series: [
  //       {
  //         type: 'PieSeries',
  //         dataFields: {
  //           value: 'litres',
  //           category: 'country',
  //         },
  //       },
  //     ],

  //     // Add data
  //     data: [
  //       {
  //         country: 'Lithuania',
  //         litres: 501.9,
  //       },
  //       {
  //         country: 'Czech Republic',
  //         litres: 301.9,
  //       },
  //       {
  //         country: 'Ireland',
  //         litres: 201.1,
  //       },
  //       {
  //         country: 'Germany',
  //         litres: 165.8,
  //       },
  //       {
  //         country: 'Australia',
  //         litres: 139.9,
  //       },
  //       {
  //         country: 'Austria',
  //         litres: 128.3,
  //       },
  //       {
  //         country: 'UK',
  //         litres: 99,
  //       },
  //       {
  //         country: 'Belgium',
  //         litres: 60,
  //       },
  //       {
  //         country: 'The Netherlands',
  //         litres: 50,
  //       },
  //     ],

  //     // And, for a good measure, let's add a legend
  //     legend: {},
  //   };

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
        value: benchmark,
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
        value: npsScore,
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
    zIndex: 10,
    height: '60%',
    width: '80%',
    margin: 0,
  },
});
