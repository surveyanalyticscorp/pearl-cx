import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {
  Colors,
  getPriorityBorderColor,
  getPriorityFillerColor,
} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {ApplyButton, ListItemSeparator} from '../../../routes/CommonScreen';
import {baseTextStyles} from '../../../styles/text.styles';

const SelectPriority = ({data, selectedIndex, handleOnPress}) => {
  const [currentIndex, setIndex] = useState(selectedIndex);
  const [currentItem, setItem] = useState(data[selectedIndex]);
  // const [selectedIndex, setSelectedIndex] = useState(selectedIndex);

  const onApplyPress = () => {
    handleOnPress(currentItem, currentIndex);
  };
  const renderRow = ({item, index}) => {
    const borderColor = getPriorityBorderColor(item.title.toLowerCase());
    const backgroundColor = getPriorityFillerColor(item.title.toLowerCase());

    return (
      <TouchableWithoutFeedback
        onPress={
          () => {
            setIndex(index);
            setItem(item);
            // handleOnPress(item, index);
            // setSelectedIndex(index);
          }
          // handleOnPress(item)
        }>
        <View style={[styles.row]}>
          <IonIcon
            style={{marginHorizontal: MarginConstants.halfTab}}
            name={'flag'}
            size={20}
            color={borderColor}
          />
          <Text style={styles.title}>{item.title}</Text>
          {currentIndex === index ? (
            <IonIcon
              style={{marginHorizontal: MarginConstants.halfTab}}
              name={'checkmark'}
              size={20}
              color={Colors.filterIconColor}
            />
          ) : (
            <View />
          )}
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={ListItemSeparator}
        ListFooterComponent={<ApplyButton onPress={onApplyPress} />}
      />
    </View>
  );
};

export default SelectPriority;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1,

    paddingVertical: MarginConstants.tab1,
  },
  title: {
    flex: 1,
    ...baseTextStyles.primaryRegularText,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
