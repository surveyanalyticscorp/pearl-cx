import React from 'react';
import {View, StyleSheet} from 'react-native';
import {MarginConstants} from '../styles/margin.constants';
import {Colors} from '../styles/color.constants';

const DottedLine = ({
  width = 1.2 * MarginConstants.tab1,
  color = Colors.evenDarkerGrey,
  borderStyle = 'dotted',
}) => {
  // borderStyles  'dotted', 'dashed', solid
  return (
    <View
      style={[
        ...styles.dottedLine,
        {borderStyle: borderStyle, width: width, borderColor: color},
      ]}
    />
  );
};

const styles = StyleSheet.create({
  dottedLine: {
    borderWidth: 1,
    borderRadius: 1,

    height: 0,

    alignSelf: 'auto',
    marginHorizontal: MarginConstants.halfTab,
    marginTop: 1,
  },
});
export default DottedLine;
