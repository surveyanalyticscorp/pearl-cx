import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';

const NoActionView = () => {
  return (
    <View>
      <Text style={[styles.actionHistoryDetailText, styles.italic]}>
        No action has taken yet
      </Text>
    </View>
  );
};

export default NoActionView;

const styles = StyleSheet.create({
  actionHistoryDetailText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    color: Colors.filterIconColor,
  },
  italic: {
    fontStyle: 'italic',
  },
});
