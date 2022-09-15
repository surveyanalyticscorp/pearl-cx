import React from 'react';
import {Text, View, StyleSheet} from 'react-native';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {TextSizes} from '../styles/textsize.constants';

const HorizontalScaleBar = (props) => {
  const getNagativePercentage = () => {
    return Number(props.value) < 0 ? `${Number(props.value) * -1}%` : '0%';
  };

  const getPositivePercentage = () => {
    return Number(props.value) > 0 ? `${Number(props.value)}%` : '0%';
  };

  const BarLabel = () => {
    return (
      <View style={styles.barLabel}>
        <Text style={styles.barLabelText}>-100</Text>
        <Text style={styles.barLabelText}>0</Text>
        <Text style={styles.barLabelText}>100</Text>
      </View>
    );
  };

  const RenderMarkerView = () => {
    return (
      <View
        style={[
          styles.rowContainer,
          {
            justifyContent: 'space-between',
            paddingHorizontal: MarginConstants.tab2,
          },
        ]}>
        <View style={styles.marker} />
        <View style={styles.marker} />
        <View style={styles.marker} />
      </View>
    );
  };

  const RenderMarkerIdicatorView = () => {
    return (
      <View
        style={[
          styles.rowContainer,
          {
            justifyContent: 'space-between',
            alignItems: 'baseline',
            paddingHorizontal: MarginConstants.tab2,
          },
        ]}>
        <View style={styles.marker} />
        <View style={styles.markerBarsIndicatorNegative}>
          <View
            style={[
              styles.markerBarsIndicator,
              {width: getNagativePercentage()},
            ]}
          />
        </View>
        <View style={styles.marker} />
        <View style={styles.markerBarsIndicatorPositive}>
          <View
            style={[
              styles.markerBarsIndicator,
              {width: getPositivePercentage()},
            ]}
          />
        </View>
        <View style={styles.marker} />
      </View>
    );
  };

  const BarLine = () => {
    return (
      <View
        style={[
          styles.rowContainer,
          {
            alignItems: 'center',
            paddingHorizontal: MarginConstants.tab2,
          },
        ]}>
        <View style={styles.markerBars} />
      </View>
    );
  };

  return (
    <View style={props.style}>
      <View style={styles.container}>
        <RenderMarkerIdicatorView />
        <BarLine />
        <RenderMarkerView />
        <BarLabel />
      </View>
    </View>
  );
};

export default HorizontalScaleBar;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  rowContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    flex: 1,
    width: '100%',
  },
  barLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    flex: 1,
    width: '100%',
  },
  barLabelText: {
    color: Colors.borderColor,
    fontSize: TextSizes.secondary,
    fontFamily: FontFamily.regular,
    fontWeight: '400',
    textAlign: 'center',
    width: MarginConstants.tab4,
  },
  marker: {
    height: 9,
    width: 1,
    backgroundColor: Colors.darkGrey,
  },
  markerBars: {
    height: 1,
    flex: 2,
    backgroundColor: Colors.darkGrey,
  },

  markerBarsIndicatorNegative: {
    height: 6,
    flex: 2,
    // justifyContent: 'flex-end',
    alignItems: 'flex-end',
    justifyContent: 'flex-end',
  },

  markerBarsIndicatorPositive: {
    height: 6,
    flex: 2,
    // justifyContent: 'flex-start',
    alignItems: 'flex-start',
    justifyContent: 'flex-end',
  },

  markerBarsIndicator: {
    height: 6,
    backgroundColor: Colors.darkGrey,
  },
});
