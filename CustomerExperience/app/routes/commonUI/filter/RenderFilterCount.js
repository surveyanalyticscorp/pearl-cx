import React from 'react';
import {Pressable, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {FilterIcon} from '../FilterIcon';

const FilterCountText = ({filterCount}) => {
  return (
    <Text
      style={[
        baseTextStyles.secondaryRegularText,
        {
          color: filterCount > 0 ? Colors.accentLight : Colors.filterIconColor,
          marginEnd: MarginConstants.tab1,
        },
      ]}>{`Filters (${filterCount ?? 0})`}</Text>
  );
};

export const RenderFilterCount = ({filterCount, onPressFilter}) => {
  return (
    <View style={{flex: 1, flexDirection: 'row', justifyContent: 'flex-end'}}>
      <Pressable style={{flexDirection: 'row'}} onPress={onPressFilter}>
        <FilterIcon
          size={22}
          color={filterCount > 0 ? Colors.accentLight : Colors.filterIconColor}
        />
        <FilterCountText filterCount={filterCount} />
      </Pressable>
    </View>
  );
};
