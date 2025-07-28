import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const SelectEmailTemplate = ({handleOnPress, data}) => {
  const renderRow = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleOnPress(item)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <FlatList
      style={styles.flatList}
      data={data}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderRow}
      ItemSeparatorComponent={ListItemSeparator}
    />
  );
};

export default SelectEmailTemplate;

const styles = StyleSheet.create({
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',

    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1,
  },
  flatList: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    minHeight: '30%',
  },
  header: {
    marginHorizontal: MarginConstants.tab2,
    fontFamily: FontFamily.bold,
    fontSize: TextSizes.largeText,
    marginVertical: MarginConstants.tab1,
    color: Colors.filterIconColor,
  },
  title: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  titleForGenarateWithAI: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.accentLight,
  },
});
