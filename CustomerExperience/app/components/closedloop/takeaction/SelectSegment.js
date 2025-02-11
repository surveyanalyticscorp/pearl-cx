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
import CheckmarkIcon from '../../../routes/commonUI/CheckmarkIcon';

const SelectSegment = props => {
  const data = props.data;
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);

  const renderRow = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        testID="select-segment-button"
        onPress={() => {
          props.handleOnPress(item, index);
          setSelectedIndex(index);
        }}>
        <View style={[styles.row]}>
          <Text style={styles.title}>{item.segmentName}</Text>
          {selectedIndex === index ? <CheckmarkIcon index={index} /> : <View />}
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

export default SelectSegment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: MarginConstants.tab1,
    borderWidth: 0.5,
    padding: MarginConstants.tab1,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
