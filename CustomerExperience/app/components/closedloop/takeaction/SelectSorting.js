import React, {useState} from 'react';
import {StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {
  CheckRadioButtonItem,
  ListItemSeparator,
} from '../../../routes/CommonScreen';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {baseTextStyles} from '../../../styles/text.styles';
const itemSeparator = () => <ListItemSeparator />;

const SelectSorting = ({data, selectedIndex, handleOnPress}) => {
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  const renderRow = ({item, index}) => {
    return (
      <CheckRadioButtonItem
        checkBoxRowStyle={styles.row}
        textStyle={[
          baseTextStyles.primaryRegularText,
          {color: Colors.filterIconColor},
        ]}
        item={{...item, isChecked: currentIndex === index}}
        index={index}
        onPress={index_ => {
          setIndex(index_);
          setItem(data[index_]);
        }}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={itemSeparator}
      />
      <QPButton
        buttonColor={Colors.accentLight}
        testID="ApplyButton"
        style={[
          buttonStyles.primaryButton,
          {marginBottom: MarginConstants.tab2},
        ]}
        onPress={() => handleOnPress(currentItem, currentIndex)}
        buttonText={'Apply'}
        textStyle={buttonStyles.primaryButtonText}
      />
    </SafeAreaView>
  );
};

export default SelectSorting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab2,
  },
  flatList: {
    flex: 1,
  },
  row: {
    flexDirection: 'row',
    paddingVertical: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
  },
});
