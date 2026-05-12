import React, {useState} from 'react';
import {Keyboard, StyleSheet, TextInput, Pressable, View} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../styles/color.constants';
import {FontFamily, FontWeight} from '../../styles/font.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {translate} from '../../Utils/MultilinguaUtils';

const SegmentSearchHeader = ({onSearch, onClear}) => {
  const [searchText, setSearchText] = useState('');

  const handleChangeText = text => {
    setSearchText(text);
  };

  const handleClear = () => {
    setSearchText('');
    onClear();
    Keyboard.dismiss();
  };

  return (
    <View style={styles.searchRow}>
      <View style={[styles.searchInner, styles.bottomBar]}>
        <TextInput
          testID="search-input"
          style={[styles.searchInput, {flex: 1}]}
          value={searchText}
          placeholder={'Search using segment name'}
          returnKeyType={'search'}
          placeholderTextColor={Colors.borderColor}
          onChangeText={handleChangeText}
          onSubmitEditing={event => {
            if (event.nativeEvent.text.length > 0) {
              onSearch(event.nativeEvent.text);
            } else {
              onClear();
            }
          }}
        />
        <Pressable
          testID="clear-button"
          style={[styles.clearButton, {opacity: searchText.length > 0 ? 1 : 0}]}
          onPress={handleClear}
          disabled={searchText.length === 0}>
          <IonIcons
            style={{marginHorizontal: MarginConstants.halfTab}}
            name={'close-circle'}
            size={20}
            color={Colors.filterIconColor}
          />
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  searchRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: MarginConstants.tab1_2x,
    marginTop: MarginConstants.tab1_2x,
  },
  searchInner: {
    flexDirection: 'row',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  bottomBar: {
    borderBottomWidth: 0.5,
    borderColor: Colors.borderColor,
    padding: PaddingConstants.halfTab,
  },
  searchInput: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    fontWeight: FontWeight._400,
    color: Colors.filterIconColor,
  },
  clearButton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export {SegmentSearchHeader};
