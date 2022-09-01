import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';

const SelectPriority = (props) => {
  const [data, setData] = useState(props.data);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

  const renderRow = ({item, index}) => {
    const borderColor = item.borderColor;
    const backgroundColor = item.backgroundColor;
    return (
      <TouchableWithoutFeedback
        onPress={() =>
          // handleOnPress(item)
          props.handleOnPress(item)
        }>
        <View
          style={[
            styles.row,
            {borderColor: borderColor, backgroundColor: backgroundColor},
          ]}>
          <Text style={styles.title}>{item.title}</Text>
          {selectedIndex === index ? (
            <MaterialIcon
              style={{marginHorizontal: MarginConstants.halfTab}}
              name={item.icon}
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
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
