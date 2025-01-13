import React, {useState, useRef} from 'react';
import {View, StyleSheet, FlatList, Pressable} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {SearchTextInput} from '../../../routes/commonUI/CommonUI';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import StringUtils from '../../../Utils/StringUtils';
import {NoItemsFound} from '../../../routes/commonUI/CommonUI';
import QPButton from '../../../widgets/Button';
import {translate} from '../../../Utils/MultilinguaUtils';
import {PaddingConstants} from '../../../styles/padding.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import CheckmarkIcon from '../../../routes/commonUI/CheckmarkIcon';

const OwnerItem = ({onPress, isSelected, title}) => {
  return (
    <Pressable onPress={onPress} style={styles.row}>
      <TextLabel text={title} />
      {isSelected ? <CheckmarkIcon /> : <View />}
    </Pressable>
  );
};

const SelectTicketOwner = ({data, selectedIndex, handleOnPress}) => {
  const [ownerData, setOwnerData] = useState(data);
  const [selectedOwnerIndex, setSelectedOwnerIndex] = useState(selectedIndex);
  const [selectedItem, setSelectedItem] = useState(data[selectedIndex]);
  const textInputRef = useRef();

  function filterOwnerList(text) {
    setOwnerData(prevState =>
      StringUtils.isEmpty(text)
        ? data
        : prevState.filter(item => item.ownerName.includes(text)),
    );
  }

  const renderRow = ({item, index}) => {
    function onPress() {
      setSelectedOwnerIndex(index);
      setSelectedItem(item);
    }
    return (
      <OwnerItem
        onPress={onPress}
        isSelected={selectedOwnerIndex === index}
        title={item.ownerName}
      />
    );
  };

  return (
    <View style={styles.container}>
      <SearchTextInput
        ref={textInputRef}
        placeholder={translate('search')}
        returnKeyType={'search'}
        onChangeText={filterOwnerList}
      />
      <FlatList
        style={styles.flatList}
        data={ownerData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderRow}
        ItemSeparatorComponent={ListItemSeparator}
        ListEmptyComponent={
          <NoItemsFound>No Assignee/Owner found</NoItemsFound>
        }
      />
      <QPButton
        testID="TakeActionButton"
        buttonColor={Colors.accentLight}
        style={styles.takeActionButton}
        onPress={() => handleOnPress(selectedItem, selectedOwnerIndex)}
        buttonText={translate('select')}
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
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: MarginConstants.tab1,
    paddingVertical: MarginConstants.tab1,
  },
  takeActionText: {
    color: Colors.white,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
  },
  takeActionButton: {
    height: MarginConstants.tab4,
    marginHorizontal: MarginConstants.halfTab,
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
