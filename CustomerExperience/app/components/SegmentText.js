import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {TextSizes} from '../styles/textsize.constants';
import {Colors} from '../styles/color.constants';
import {MarginConstants} from '../styles/margin.constants';

const SegmentText = ({screenName, segmentName}) => {
  return (
    <View style={{width: '100%', flexDirection: 'column'}}>
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

const styles = StyleSheet.create({
  appbarTitle: {
    fontSize: TextSizes.primary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },

  appbarSegmentName: {
    fontSize: TextSizes.secondary,
    color: Colors.white,
    marginEnd: MarginConstants.tab3,
  },
});
export default SegmentText;
