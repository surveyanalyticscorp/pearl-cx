import React from 'react';
import {View, Text, StyleSheet, Platform} from 'react-native';
import {TextSizes} from '../styles/textsize.constants';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';
import {FontFamily} from '../styles/font.constants';

const SegmentTextForIpad = ({screenName, segmentName}) => {
  const text = `${screenName} > ${segmentName}`;
  return (
    <View style={styles.segmentTextForIpad}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.appbarTitle}>
        {text}
      </Text>
    </View>
  );
};

const DefaultSegmentText = ({screenName, segmentName}) => {
  return (
    <View style={{flex: 1, flexDirection: 'column'}}>
      <Text numberOfLines={1} ellipsizeMode="tail" style={styles.appbarTitle}>
        {screenName}
      </Text>
      <Text
        numberOfLines={1}
        ellipsizeMode="tail"
        style={styles.appbarSegmentName}>
        {segmentName}
      </Text>
    </View>
  );
};
const SegmentText = ({screenName, segmentName}) => {
  const isPad = Platform.OS && Platform.isPad;

  if (isPad) {
    return (
      <SegmentTextForIpad screenName={screenName} segmentName={segmentName} />
    );
  }
  return (
    <DefaultSegmentText screenName={screenName} segmentName={segmentName} />
  );
};

const styles = StyleSheet.create({
  appbarTitle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },

  appbarSegmentName: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },
  segmentTextForIpad: {
    marginStart: MarginConstants.tab1_2x,
    width: '95%',
    flexDirection: 'column',
  },
});
export default SegmentText;
