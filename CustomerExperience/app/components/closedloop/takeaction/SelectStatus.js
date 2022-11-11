import React, {useState} from 'react';
import {
  View,
  // TouchableWithoutFeedback,
  // Text,
  StyleSheet,
  FlatList,
} from 'react-native';
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
const SelectStatus = (props) => {
  const [data, setData] = useState(props.data);
  // const [selectedIndex, setSelectedIndex] = useState();

  const renderRow = ({item, index}) => {
    console.log(props.selectedIndex);
    return (
      <StatusItem
        item={item}
        selectedIndex={props.selectedIndex}
        index={index}
        onPressHandler={() => {
          props.handleOnPress(item, index);
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
