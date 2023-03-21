import React, {useState, useRef} from 'react';
import {
  View,
  TouchableWithoutFeedback,
  Text,
  StyleSheet,
  FlatList,
  TextInput,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import IonIcon from 'react-native-vector-icons/Ionicons';
import {listItemSeparator} from '../../../routes/CommonScreen';
import {PaddingConstants} from '../../../styles/padding.constants';
import StringUtils from '../../../Utils/StringUtils';
import {NoItemsFound} from '../../../routes/CommonScreen';

const SelectTicketOwner = (props) => {
  const [data, setData] = useState(props.data);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);
  const textInputRef = useRef();

  function filterOwnerList(text) {
    if (StringUtils.isEmpty(text)) {
      setData(props.data);
    } else {
      setData((prevState) =>
        prevState.filter((item) => item.ownerName.includes(text)),
      );
    }
  }
  const renderRow = ({item, index}) => {
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
          <Text style={styles.title}>{item.ownerName}</Text>
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
      <TextInput
        ref={textInputRef}
        defaultValue={''}
        style={styles.search}
        placeholder="Search assignee/Owner name here..."
        returnKeyType={'search'}
        onChangeText={(text) => {
          filterOwnerList(text);
        }}
      />
      <FlatList
        style={styles.flatList}
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={listItemSeparator}
        ListEmptyComponent={
          <NoItemsFound>No Assignee/Owner found</NoItemsFound>
        }
      />
    </View>
  );
};

export default SelectTicketOwner;

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
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
  search: {
    padding: PaddingConstants.halfTab,
    margin: MarginConstants.halfTab,
    borderColor: Colors.filterIconColor,
    borderBottomWidth: 0.5,
  },
});
