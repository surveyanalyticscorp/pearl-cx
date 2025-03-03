import React from 'react';
import StringUtils from '../../Utils/StringUtils';
import {Text} from 'react-native';
import {TextSizes} from '../../styles/textsize.constants';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {StyleSheet} from 'react-native';

const styles = StyleSheet.create({
  dateText: {
    fontFamily: FontFamily.regular,
    fontWeight: FontWeight._400,
    fontSize: TextSizes.primary,
    color: Colors.primary,
  },
});
const NoDataFound = ({dataText}) => {
  return (
    <Text style={styles.dateText}>
      {StringUtils.uppercaseFirstCharRestLowercase(`No ${dataText} found`)}
    </Text>
  );
};

export default NoDataFound;
