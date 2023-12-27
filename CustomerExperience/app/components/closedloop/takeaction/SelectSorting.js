import React, {useState} from 'react';
import {
  View,
  // TouchableWithoutFeedback,
  // Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  CheckRadioButtonItem,
  ListItemSeparator,
  RadioButtonCheckbox,
} from '../../../routes/CommonScreen';
import {
  Colors,
  // getStatusBorderColor,
  // getStatusFillerColor,
} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import IonIcon from 'react-native-vector-icons/Ionicons';
import StatusItem from './StatusItem';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
const itemSeparator = () => (
  <ListItemSeparator style={{marginHorizontal: MarginConstants.tab1}} />
);

const SelectSorting = ({data, selectedIndex, handleOnPress}) => {
  // const [data, setData] = useState(data);
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  // const [selectedIndex, setSelectedIndex] = useState();
  const renderRow = ({item, index}) => {
    return (
      <CheckRadioButtonItem
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
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={itemSeparator}
        ListFooterComponent={
          <QPButton
            buttonColor={Colors.accentLight}
            testID="ApplyButton"
            style={[buttonStyles.primaryButton, {margin: MarginConstants.tab2}]}
            onPress={() => handleOnPress(currentItem, currentIndex)}
            buttonText={'Apply'}
            textStyle={buttonStyles.primaryButtonText}
          />
        }
      />
    </View>
  );
};

export default SelectSorting;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
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
