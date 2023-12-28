import React, {useState} from 'react';
import {
  View,
  // TouchableWithoutFeedback,
  // Text,
  StyleSheet,
  FlatList,
  SafeAreaView,
} from 'react-native';
import {
  CheckRadioButtonItem,
  ListItemSeparator,
  RadioButtonCheckbox,
} from '../../../routes/CommonScreen';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
const itemSeparator = () => (
  <ListItemSeparator
    style={{
      marginBottom: MarginConstants.tab1,
      marginHorizontal: MarginConstants.tab1,
    }}
  />
);

const SelectSorting = ({data, selectedIndex, handleOnPress}) => {
  // const [data, setData] = useState(data);
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  // const [selectedIndex, setSelectedIndex] = useState();
  const renderRow = ({item, index}) => {
    return (
      <CheckRadioButtonItem
        checkBoxRowStyle={styles.row}
        textStyle={styles.textStyle}
        item={{...item, isChecked: currentIndex === index}}
        index={index}
        onPress={index_ => {
          // handleOnPress(item, index);

          setIndex(index_);
          setItem(data[index_]);
        }}
      />
      // <StatusItem
      //   item={item}
      //   selectedIndex={currentIndex}
      //   index={index}
      //   onPressHandler={() => {
      //     // props.handleOnPress(item, index);
      //     setIndex(index);
      //     setItem(item);
      //   }}
      // />
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
    marginTop: MarginConstants.tab1,
  },
  row: {
    flexDirection: 'row',
    marginTop: MarginConstants.tab2,
    marginBottom: MarginConstants.halfTab,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  textStyle: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
  },
});
