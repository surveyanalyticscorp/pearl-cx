import React from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {baseTextStyles} from '../../../styles/text.styles';
import {translate} from '../../../Utils/MultilinguaUtils';

export const SearchIcon = () => {
  return (
    <IonIcons
      testID="search-icon"
      name="search"
      size={20}
      color={Colors.evenDarkerGrey}
    />
  );
};

export const SearchBox = ({onResetSearch, onQuerySubmit, currentText}) => {
  return (
    <View testID="search-box" style={styles.searchBox}>
      <SearchIcon />
      <TextInput
        testID="search-box-input"
        defaultValue={currentText}
        placeholder={translate('ticket_search_hint')}
        placeholderTextColor={Colors.evenDarkerGrey}
        style={[
          baseTextStyles.secondaryRegularText,
          {flex: 1, height: 42, margin: 0, color: Colors.filterIconColor},
        ]}
        returnKeyType={'search'}
        onSubmitEditing={event => {
          onQuerySubmit(event.nativeEvent.text);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
    paddingHorizontal: MarginConstants.tab1,
    paddingVertical: Platform.OS === 'ios' ? MarginConstants.halfTab : 0,
    borderWidth: 0.5,
    borderRadius: 8,
    borderColor: Colors.filterIconColor,
  },
});
