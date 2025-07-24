import React, {useState} from 'react';
import {StyleSheet, FlatList, SafeAreaView} from 'react-native';
import {CheckRadioButtonItem} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
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
    <FlatList
      style={styles.container}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRow}
      ItemSeparatorComponent={itemSeparator}
      ListFooterComponent={
        <QPButton
          buttonColor={Colors.accentLight}
          testID="ApplyButton"
          style={[
            buttonStyles.primaryButton,
            {marginVertical: MarginConstants.tab1_4x},
          ]}
          onPress={() => handleOnPress(currentItem, currentIndex)}
          buttonText={'Apply'}
          textStyle={buttonStyles.primaryButtonText}
        />
      }
    />
  );
};

export default SelectSorting;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    margin: MarginConstants.tab2,
  },

  row: {
    flexDirection: 'row',
    paddingVertical: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
  },
});
