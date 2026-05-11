import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import {textStyles} from '../../../styles/text.styles';

const FilterSection = ({title, filterData, onItemSelect, testID}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.chipContainer} testID={testID}>
        {filterData.map((item, index) => (
          <ChipItem
            key={index}
            textStyle={textStyles.chipText}
            item={item}
            index={index}
            onPress={onItemSelect}
          />
        ))}
      </View>
    </View>
  );
};

export default FilterSection;

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
