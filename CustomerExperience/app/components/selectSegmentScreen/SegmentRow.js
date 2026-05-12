import React from 'react';
import {StyleSheet, Text, TouchableWithoutFeedback, View} from 'react-native';
import CheckmarkIcon from '../../routes/commonUI/CheckmarkIcon';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {TextSizes} from '../../styles/textsize.constants';

const SegmentRow = ({item, index, currentSegmentId, onPress}) => (
  <TouchableWithoutFeedback onPress={() => onPress(item)}>
    <View style={styles.row}>
      <Text style={styles.title}>{item.segmentName}</Text>
      {currentSegmentId === item.segmentID ? (
        <CheckmarkIcon index={index} />
      ) : (
        <View />
      )}
    </View>
  </TouchableWithoutFeedback>
);

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1_2x,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});

export {SegmentRow};
