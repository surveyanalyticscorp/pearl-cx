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
import {listItemSeparator} from '../../../routes/CommonScreen';

const SelectPriority = (props) => {
  const [data, setData] = useState(props.data);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

  const renderRow = ({item, index}) => {
    const borderColor = getPriorityBorderColor(item.title.toLowerCase());
    const backgroundColor = getPriorityFillerColor(item.title.toLowerCase());

    return (
      <TouchableWithoutFeedback
        onPress={
          () => {
            props.handleOnPress(item, index);
            setSelectedIndex(index);
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
          {selectedIndex === index ? (
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
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={listItemSeparator}
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
    margin: MarginConstants.tab1,

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
