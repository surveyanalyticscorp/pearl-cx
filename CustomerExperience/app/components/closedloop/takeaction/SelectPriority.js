import React, {useState} from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {ApplyButton} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {PaddingConstants} from '../../../styles/padding.constants';
import PriorityItem from './PriorityItem';

const SelectPriority = ({data, selectedIndex, handleOnPress}) => {
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);

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
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={
          <ApplyButton buttonText={'Set priority'} onPress={onApplyPress} />
        }
      />
    </View>
  );
};

export default SelectPriority;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
  },
});
