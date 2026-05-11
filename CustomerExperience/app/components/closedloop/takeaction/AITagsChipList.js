import React from 'react';
import {View, StyleSheet} from 'react-native';
import {PaddingConstants} from '../../../styles/padding.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import {textStyles} from '../../../styles/text.styles';

const AITagsChipList = ({checkedTags, onItemSelect, onCountChipPress, testID}) => {
  const visibleTags = checkedTags.slice(0, 4);
  const remainingCount = checkedTags.length - 4;

  return (
    <View style={styles.chipContainer} testID={testID}>
      {visibleTags.map((item, index) => (
        <ChipItem
          key={index}
          textStyle={textStyles.chipText}
          item={item}
          title={item?.name}
          index={index}
          onPress={onItemSelect}
        />
      ))}
      {remainingCount > 0 && (
        <ChipItem
          key="count-chip"
          textStyle={textStyles.chipText}
          item={{name: `${remainingCount}+`, isChecked: true}}
          title={`${remainingCount}+`}
          index={-1}
          onPress={onCountChipPress}
        />
      )}
    </View>
  );
};

export default AITagsChipList;

const styles = StyleSheet.create({
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
