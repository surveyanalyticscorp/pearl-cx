import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {ApplyButton} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import StatusItem from './StatusItem';
import {PaddingConstants} from '../../../styles/padding.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
const statusListItemSeparator = () => (
  <ListItemSeparator style={{marginHorizontal: MarginConstants.tab1}} />
);

const getButtonTitle = screenName => {
  switch (screenName) {
    case 'CreateTicket':
      return 'Set status';
    case 'Dashboard':
      return 'Set filter by status';
    default:
      return 'Update status';
  }
};

const SelectStatus = ({data, selectedIndex, handleOnPress, screenName}) => {
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  const buttonTitle = getButtonTitle(screenName);
  const onApplyPress = () => {
    handleOnPress(currentItem, currentIndex);
  };

  const renderRow = ({item, index}) => {
    return (
      <StatusItem
        item={item}
        selectedIndex={currentIndex}
        index={index}
        onPressHandler={() => {
          // props.handleOnPress(item, index);
          setIndex(index);
          setItem(item);
        }}
      />
    );
  };

  return (
    <FlatList
      style={styles.container}
      contentContainerStyle={{flexGrow: 0}}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRow}
      ItemSeparatorComponent={statusListItemSeparator}
      ListFooterComponent={
        <ApplyButton buttonText={buttonTitle} onPress={onApplyPress} />
      }
    />
  );
};

export default SelectStatus;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingBottom: PaddingConstants.tab1_2x,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: MarginConstants.tab1,
    borderWidth: 1,
    padding: MarginConstants.tab1,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
