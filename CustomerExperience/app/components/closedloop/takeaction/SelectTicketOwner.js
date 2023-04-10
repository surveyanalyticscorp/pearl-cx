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
import {listItemSeparator, SearchTextInput} from '../../../routes/CommonScreen';
// import {PaddingConstants} from '../../../styles/padding.constants';
import StringUtils from '../../../Utils/StringUtils';
import {NoItemsFound} from '../../../routes/CommonScreen';
import QPButton from '../../../widgets/Button';

const SelectTicketOwner = props => {
  const [data, setData] = useState(props.data);
  const [selectedIndex, setSelectedIndex] = useState(props.selectedIndex);
  const [selectedItem, setSelectedItem] = useState(
    props.data[props.selectedIndex],
  );
  const textInputRef = useRef();

  function filterOwnerList(text) {
    if (StringUtils.isEmpty(text)) {
      setData(props.data);
    } else {
      setData(prevState =>
        prevState.filter(item => item.ownerName.includes(text)),
      );
    }
  }
  const renderRow = ({item, index}) => {
    return (
      <TouchableWithoutFeedback
        onPress={
          () => {
            // props.handleOnPress(item, index);
            setSelectedIndex(index);
            setSelectedItem(item);
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
      <SearchTextInput
        ref={textInputRef}
        placeholder={'Search...'}
        returnKeyType={'search'}
        onChangeText={filterOwnerList}
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
      <QPButton
        testID="TakeActionButton"
        buttonColor={Colors.accentLight}
        style={styles.takeActionButton}
        onPress={() => props.handleOnPress(selectedItem, selectedIndex)}
        buttonText={'Select'}
        textStyle={styles.takeActionText}
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
  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    marginHorizontal: MarginConstants.tab2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.filterIconColor,
    marginBottom: MarginConstants.tab2,
  },
  title: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
