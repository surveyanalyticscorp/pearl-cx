import React from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {CloseButton, listItemSeparator} from '../../../routes/CommonScreen';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
const SelectEmailTemplate = () => {
  const data = [
    'Template 01',
    'Template 02',
    'Template 03',
    'Template 04',
    'Template 05',
  ];

  const renderRow = ({item}) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleOnPress(item)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const handleOnPress = (item) => {
    console.log(item);
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>Select Template</Text>
        <CloseButton color={Colors.filterIconColor} />
      </View>
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

export default SelectEmailTemplate;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
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
});
