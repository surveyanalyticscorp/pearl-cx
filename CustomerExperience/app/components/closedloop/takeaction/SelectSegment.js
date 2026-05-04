import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
  Pressable,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import CheckmarkIcon from '../../../routes/commonUI/CheckmarkIcon';
import {useSelector} from 'react-redux';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {PaddingConstants} from '../../../styles/padding.constants';

const SelectSegment = props => {
  const data = useSelector(state => state.dashboard.segmentList);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);
  console.log(
    'SEGMENT_TEST',

    'SelectSegment component',
    JSON.stringify(data),
  );
  const renderRow = ({item, index}) => {
    return (
      <Pressable
        testID="select-segment-button"
        onPress={
          () => {
            props.handleOnPress(item, index);
            setSelectedIndex(index);
          }
          // handleOnPress(item)
        }>
        <View style={[styles.row]}>
          <Text style={styles.title}>{item.segmentName}</Text>
          {selectedIndex === index ? <CheckmarkIcon index={index} /> : <View />}
        </View>
      </Pressable>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={<ListItemSeparator />}
      />
    </View>
  );
};

export default SelectSegment;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',

    paddingVertical: MarginConstants.tab1_2x,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  flatList: {
    paddingTop: PaddingConstants.tab1,
    maxHeight: '70%',
  },
});
