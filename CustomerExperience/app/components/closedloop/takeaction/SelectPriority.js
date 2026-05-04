import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {ApplyButton} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {PaddingConstants} from '../../../styles/padding.constants';
import PriorityItem from './PriorityItem';

const getButtonTitle = screenName => {
  switch (screenName) {
    case 'CreateTicket':
      return 'Set priority';

    default:
      return 'Update priority';
  }
};
const SelectPriority = ({data, selectedIndex, handleOnPress, screenName}) => {
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  // const [selectedIndex, setSelectedIndex] = useState(selectedIndex);
  const buttonTitle = getButtonTitle(screenName);
  const onApplyPress = () => {
    handleOnPress(currentItem, currentIndex);
  };
  const renderRow = ({item, index}) => {
    return (
      <PriorityItem
        index={index}
        item={item}
        selectedIndex={currentIndex}
        onPressHandler={() => {
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
      ItemSeparatorComponent={ListItemSeparator}
      ListFooterComponent={
        <ApplyButton buttonText={buttonTitle} onPress={onApplyPress} />
      }
    />
  );
};

export default SelectPriority;

const styles = StyleSheet.create({
  container: {
    // flex: 1, // Remove flex: 1 for shrink-wrap
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
  },
});
