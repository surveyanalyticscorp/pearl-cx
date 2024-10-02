import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
const TicketTakeAction = ({data, handleOnPress}) => {
  const renderRow = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        testID={`row-touchable-${index}`} // Added testID for TouchableWithoutFeedback
        onPress={() => handleOnPress(item)}>
        <View style={styles.row}>
          <MaterialIcon
            name={item.icon}
            size={20}
            color={Colors.filterIconColor}
            testID={`row-icon-${index}`} // Added testID for MaterialIcon
          />
          <Text style={styles.title} testID={`row-title-${index}`}>
            {item.title}
          </Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  return (
    <View testID="take-action-container" style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        testID="take-action-flatlist" // Added testID for FlatList
      />
    </View>
  );
};

export default TicketTakeAction;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'baseline',

    justifyContent: 'space-between',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
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
