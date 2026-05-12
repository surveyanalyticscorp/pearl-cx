import React, {useCallback} from 'react';
import {FlatList, StyleSheet, View} from 'react-native';
import {NoItemsFound} from '../../routes/commonUI/CommonUI';
import useSegmentList from '../../hooks/useSegmentList';
import ListItemSeparator from '../../routes/commonUI/ListItemSeparator';
import {MarginConstants} from '../../styles/margin.constants';
import {SegmentSearchHeader} from './SegmentSearchHeader';
import {SegmentRow} from './SegmentRow';

const keyExtractor = item => item.segmentID + '';
const emptyComponent = <NoItemsFound>No Segment found</NoItemsFound>;

const SegmentSheetContent = ({currentSegmentId, onSelect}) => {
  const {segmentList, onSearchHandler, refresh} = useSegmentList();

  const handleSelect = useCallback(
    item => {
      refresh();
      onSelect(item);
    },
    [refresh, onSelect],
  );

  const clearSearchHandler = useCallback(() => refresh(), [refresh]);

  const renderRow = useCallback(
    ({item, index}) => (
      <SegmentRow
        item={item}
        index={index}
        currentSegmentId={currentSegmentId}
        onPress={handleSelect}
      />
    ),
    [handleSelect, currentSegmentId],
  );

  return (
    <View style={styles.container}>
      <SegmentSearchHeader
        onSearch={onSearchHandler}
        onClear={clearSearchHandler}
      />
      <FlatList
        style={styles.list}
        data={segmentList}
        keyExtractor={keyExtractor}
        renderItem={renderRow}
        ItemSeparatorComponent={ListItemSeparator}
        onEndReachedThreshold={0.25}
        ListEmptyComponent={emptyComponent}
        refreshing={false}
        extraData={segmentList}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  list: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1_2x,
    marginVertical: MarginConstants.tab1,
  },
});

export {SegmentSheetContent};
