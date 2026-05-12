import React, {useCallback} from 'react';
import {FlatList, Platform, StyleSheet, Text, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {CloseButton, NoItemsFound} from '../routes/commonUI/CommonUI';
import useSegmentList from '../hooks/useSegmentList';
import ListItemSeparator from '../routes/commonUI/ListItemSeparator';
import {Colors} from '../styles/color.constants';
import {FontFamily} from '../styles/font.constants';
import {MarginConstants} from '../styles/margin.constants';
import {PaddingConstants} from '../styles/padding.constants';
import {TextSizes} from '../styles/textsize.constants';
import {translate} from '../Utils/MultilinguaUtils';
import {SegmentSearchHeader} from './selectSegmentScreen/SegmentSearchHeader';
import {SegmentRow} from './selectSegmentScreen/SegmentRow';
import {useSelectSegment} from './selectSegmentScreen/hooks/useSelectSegment';

const keyExtractor = item => item.segmentID + '';
const emptyComponent = <NoItemsFound>No Segment found</NoItemsFound>;

const SelectSegmentScreen = props => {
  const {currentSegmentId, setSegmentSelection} = props.route.params;
  const insets = useSafeAreaInsets();
  const {segmentList, onSearchHandler, refresh} = useSegmentList();
  const {handleSegmentSelectionAction, clearSearchHandler} = useSelectSegment({
    setSegmentSelection,
    refresh,
  });

  const renderRow = useCallback(
    ({item, index}) => (
      <SegmentRow
        item={item}
        index={index}
        currentSegmentId={currentSegmentId}
        onPress={handleSegmentSelectionAction}
      />
    ),
    [handleSegmentSelectionAction, currentSegmentId],
  );

  return (
    <View style={[styles.rootContainer, {paddingTop: insets.top}]}>
      <View style={styles.container}>
        <View style={styles.headerRow}>
          <Text style={styles.headerText}>
            {translate('dashboard.segment')}
          </Text>
          <CloseButton color={Colors.filterIconColor} />
        </View>

        <SegmentSearchHeader
          onSearch={onSearchHandler}
          onClear={clearSearchHandler}
        />

        <FlatList
          style={styles.flatList}
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
    </View>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginTop:
      Platform.OS === 'ios' ? MarginConstants.tab1_4x : MarginConstants.tab1,
  },
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopStartRadius: 8,
    borderTopEndRadius: 8,
    marginTop: MarginConstants.tab1,
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
    textAlign: 'center',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: PaddingConstants.tab1_2x,
  },
  flatList: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1_2x,
    marginVertical: MarginConstants.tab1,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
  },
});

export default SelectSegmentScreen;
