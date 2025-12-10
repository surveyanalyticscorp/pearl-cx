import React, {useState, useCallback, useEffect} from 'react';
import {View, Text, StyleSheet, TextInput, ScrollView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {baseTextStyles, textStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {PanelHandler} from '../../../routes/commonUI/BottomSheetHeader';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {useDispatch, useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import {
  getTaglist,
  updateSingleTag,
} from '../../../redux/actions/closedloop.actions';

// Search bar component
const SearchBar = ({searchText, onSearchChange, placeholder}) => {
  return (
    <View style={styles.searchContainer}>
      <TextInput
        style={styles.searchInput}
        placeholder={placeholder || 'Search tags...'}
        placeholderTextColor={Colors.evenDarkerGrey}
        value={searchText}
        onChangeText={onSearchChange}
        autoCapitalize="none"
        autoCorrect={false}
      />
    </View>
  );
};

// AI Tags section component
const AiTagsSection = ({title, filterData, onItemSelect, testID}) => {
  return (
    <ScrollView style={styles.sectionContainer}>
      {/* <Text style={styles.titleText}>{title}</Text> */}
      <View style={styles.chipContainer} testID={testID}>
        {filterData.map((item, index) => (
          <ChipItem
            key={item.id + item?.name}
            textStyle={textStyles.optionText}
            title={item?.name}
            item={item}
            index={index}
            onPress={onItemSelect}
          />
        ))}
      </View>
    </ScrollView>
  );
};

// Done button component
const DoneButton = ({onDone}) => {
  return (
    <View style={styles.doneButtonContainer}>
      <QPButton
        style={[buttonStyles.textButton]}
        buttonColor={Colors.white}
        onPress={onDone}
        textStyle={buttonStyles.textButtonTextPrimaryLarge}
        buttonText={'Done'}
      />
    </View>
  );
};

const AiTagsFilter = () => {
  const aiTags = useSelector(state => state.dashboard.ticketTags);
  //   const [aiTagsState, setAiTagsState] = useState(aiTags ?? []);
  const navigation = useNavigation();
  const {feedbackID} = useSelector(state => state.global.userInfo);
  const [searchText, setSearchText] = useState('');
  const dispatch = useDispatch();
  // Filter tags based on search text
  const filteredTags = aiTags.filter(tag =>
    tag.name.toLowerCase().includes(searchText.toLowerCase()),
  );

  const [pageOption, setPageOption] = useState({
    perPage: 100,
    pageNumber: 1,
  });

  useEffect(() => {
    dispatch(getTaglist({feedbackId: feedbackID, param: pageOption}));
  }, []);

  const handleTagSelect = useCallback((item, index) => {
    dispatch(updateSingleTag({...item, isChecked: !item.isChecked}));
    // setAiTagsState(prevState =>
    //   prevState.map(tagItem =>
    //     tagItem.id === item.id
    //       ? {...tagItem, isChecked: !tagItem.isChecked}
    //       : tagItem,
    //   ),
    // );
    console.log('handleTagSelect item:', item);
  }, []);

  const handleSearchChange = useCallback(text => {
    setSearchText(text);
  }, []);

  const navigateBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);

  const onDoneHandler = useCallback(() => {
    // setTags in redux

    navigateBack();
  }, [navigateBack]);

  return (
    <View style={styles.container}>
      <View style={styles.innerContainer}>
        <PanelHandler />
        <View style={styles.headerContainer}>
          <TextLabel text={'AI Tags'} style={styles.headerText} />
          <DoneButton onDone={onDoneHandler} />
        </View>

        <VerticalSpaceBox multiplyBy={2} />

        <SearchBar
          searchText={searchText}
          onSearchChange={handleSearchChange}
          placeholder="Search tags"
        />

        <VerticalSpaceBox multiplyBy={3} />

        <AiTagsSection
          title="Available Tags"
          filterData={filteredTags}
          onItemSelect={handleTagSelect}
          testID="render-ai-tags"
        />

        <VerticalSpaceBox multiplyBy={6} />
      </View>
    </View>
  );
};

export default AiTagsFilter;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1,
    justifyContent: 'flex-start',
  },
  innerContainer: {
    flex: 1,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingEnd: PaddingConstants.tab1,
  },
  headerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.extraLargeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingConstants.halfTab,
  },
  searchContainer: {
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
  searchInput: {
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.tab1,
    borderBottomColor: Colors.darkGrey,
    borderBottomWidth: 1,
    fontSize: TextSizes.primary,
    fontFamily: FontFamily.regular,
    color: Colors.filterIconColor,
    backgroundColor: Colors.settingsBackground,
  },
  doneButtonContainer: {
    alignItems: 'flex-end',
    paddingHorizontal: PaddingConstants.tab1,
  },
  doneButton: {
    paddingHorizontal: PaddingConstants.tab2,
    paddingVertical: PaddingConstants.halfTab,
    minWidth: 80,
  },
});
