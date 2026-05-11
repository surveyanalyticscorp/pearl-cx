import React from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {SortIcon} from '../SortIcon';
import {FilterDateBox} from './FilterDateBox';
import {RenderFilterCount} from './RenderFilterCount';

export const HeaderFilter = ({
  hasFilterIcon = true,
  hasSortIcon = false,
  onPressFilter,
  filterCount,
  endComponent,
  style,
}) => {
  return (
    <View style={[styles.filterAndSearchBox, {...style}]}>
      {hasSortIcon && <SortIcon onPressFilter={onPressFilter} />}
      <FilterDateBox />
      {hasFilterIcon && (
        <RenderFilterCount
          filterCount={filterCount}
          onPressFilter={onPressFilter}
        />
      )}
      {endComponent}
    </View>
  );
};

const styles = StyleSheet.create({
  filterAndSearchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PaddingConstants.halfTab,
    paddingHorizontal: PaddingConstants.tab1_2x,
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
});
