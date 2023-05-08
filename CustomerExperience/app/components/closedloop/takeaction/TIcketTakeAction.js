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
const TicketTakeAction = props => {
  const [data, setData] = useState(props.data);

  const renderRow = ({item}) => {
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          // handleOnPress(item)
          props.handleOnPress(item)
        }>
        <View style={styles.row}>
          <MaterialIcon
            name={item.icon}
            size={20}
            color={Colors.filterIconColor}
          />
          <Text style={styles.title}>{item.title}</Text>
        </View>
      </TouchableWithoutFeedback>
    );
  };

  const handleOnPress = item => {
    // console.log(item.title);
  };

  return (
    <View style={styles.container}>
      {/* <View style={styles.headerRow}>
        <Text style={styles.header}>Take Action</Text>
        <CloseButton color={Colors.filterIconColor} />
      </View> */}
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
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
