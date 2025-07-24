import React from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {CheckRadioButtonItem} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {baseTextStyles} from '../../../styles/text.styles';
const itemSeparator = () => <ListItemSeparator />;

const SelectSorting = ({data, selectedIndex, handleOnPress}) => {
  const renderRow = ({item, index}) => {
    return (
      <CheckRadioButtonItem
        checkBoxRowStyle={styles.row}
        textStyle={[
          baseTextStyles.primaryRegularText,
          {color: Colors.filterIconColor},
        ]}
        item={{...item, isChecked: selectedIndex === index}}
        index={index}
        onPress={index_ => {
          handleOnPress(data[index_], index_);
        }}
      />
    );
  };

  return (
    <FlatList
      style={styles.flatlist}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRow}
      ItemSeparatorComponent={itemSeparator}
    />
  );
};

export default SelectSorting;

const styles = StyleSheet.create({
  flatlist: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab1_2x,
    paddingBottom: MarginConstants.tab1_4x,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
  },
});
