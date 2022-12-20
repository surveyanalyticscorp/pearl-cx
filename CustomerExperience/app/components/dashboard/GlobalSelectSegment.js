import React, {useState} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {listItemSeparator} from '../../routes/CommonScreen';
import {Colors} from '../../styles/color.constants';
import {FontFamily} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {TextSizes} from '../../styles/textsize.constants';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {PaddingConstants} from '../../styles/padding.constants';
// import {getSegmentIndex} from '../../Utils/TicketUtils';
// import {FlatList} from 'react-native-gesture-handler';

const GlobalSelectSegment = ({
  currentSegmentId,
  data,
  loadMoreData,
  handleOnPress,
}) => {
  const [filteredList, setFilteredList] = useState(data);
  // const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex ?? 0);

  const renderRow = ({item, index}) => {
    return (
      <TouchableWithoutFeedback onPress={() => handleOnPress(item)}>
        <View style={styles.row}>
          <Text style={styles.title}>{item.segmentName}</Text>
          {currentSegmentId === item.segmentID ? (
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

  // const handleOnPress = (item, index) => {
  //   handleOnPress(item);
  // };

  console.log('Segment_API_CALL', JSON.stringify(filteredList));

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search..."
        onChangeText={(text) => {
          console.log(text);
          if (text) {
            setFilteredList((state) =>
              state.filter((item) =>
                item.segmentName.toLowerCase().includes(text.toLowerCase()),
              ),
            );
          } else {
            setFilteredList(data);
          }
        }}
      />
      {filteredList && filteredList.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={filteredList}
          keyExtractor={(item, index) => item.segmentName}
          renderItem={renderRow}
          ItemSeparatorComponent={listItemSeparator}
          onEndReached={loadMoreData}
          onEndReachedThreshold={0}
          extraData={[filteredList]}
        />
      ) : (
        <View />
      )}
    </View>
  );
};

export default GlobalSelectSegment;

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
    marginVertical: MarginConstants.tab2,
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
  searchInput: {
    borderBottomWidth: 1,
    borderColor: Colors.filterIconColor,
    marginHorizontal: MarginConstants.tab2,
    marginBottom: MarginConstants.tab2,
    paddingHorizontal: PaddingConstants.halfTab,
  },
});
