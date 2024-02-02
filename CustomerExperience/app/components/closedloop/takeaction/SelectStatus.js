import React, {useState} from 'react';
import {
  View,
  // TouchableWithoutFeedback,
  // Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {ApplyButton, ListItemSeparator} from '../../../routes/CommonScreen';
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
const statusListItemSeparator = () => (
  <ListItemSeparator style={{marginHorizontal: MarginConstants.tab1}} />
);

const SelectStatus = ({data, selectedIndex, handleOnPress}) => {
  // const [data, setData] = useState(data);
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  // const [selectedIndex, setSelectedIndex] = useState();

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
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={statusListItemSeparator}
        ListFooterComponent={<ApplyButton onPress={onApplyPress} />}
      />
    </View>
  );
};

export default SelectStatus;

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
