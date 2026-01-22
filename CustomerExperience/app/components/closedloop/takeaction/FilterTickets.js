import React, {useState, useCallback} from 'react';
import {
  View,
  Text,
  StyleSheet,
  Platform,
  Switch,
  ScrollView,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {ChipItem} from '../../../routes/commonUI/CommonUI';
import {translate} from '../../../Utils/MultilinguaUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {textStyles} from '../../../styles/text.styles';
import {HorizontalSpaceBox, VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {
  CloseButton,
  PanelHandler,
} from '../../../routes/commonUI/BottomSheetHeader';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {useNavigation} from '@react-navigation/native';
import {useDispatch, useSelector} from 'react-redux';
import {
  clearTagFilter,
  updateSingleTag,
} from '../../../redux/actions/closedloop.actions';
import {get} from 'lodash';

const FilterSection = ({title, filterData, onItemSelect, testID}) => {
  return (
    <View style={styles.sectionContainer}>
      <Text style={styles.titleText}>{title}</Text>
      <View style={styles.chipContainer} testID={testID}>
        {filterData.map((item, index) => (
          <ChipItem
            key={index}
            textStyle={textStyles.optionText}
            item={item}
            index={index}
            onPress={onItemSelect}
          />
        ))}
      </View>
    </View>
  );
};

const AITagsChipList = ({
  checkedTags,
  onItemSelect,
  onCountChipPress,
  testID,
}) => {
  const visibleTags = checkedTags.slice(0, 4);
  const remainingCount = checkedTags.length - 4;

  return (
    <View style={styles.chipContainer} testID={testID}>
      {visibleTags.map((item, index) => (
        <ChipItem
          key={index}
          textStyle={textStyles.optionText}
          item={item}
          title={item?.name}
          index={index}
          onPress={onItemSelect}
        />
      ))}
      {remainingCount > 0 && (
        <ChipItem
          key="count-chip"
          textStyle={textStyles.optionText}
          item={{name: `${remainingCount}+`, isChecked: true}}
          title={`${remainingCount}+`}
          index={-1}
          onPress={onCountChipPress}
        />
      )}
    </View>
  );
};

const AITagsFilterSection = ({title, testID}) => {
  const dispatch = useDispatch();
  const aiTags = useSelector(state => state.dashboard.ticketTags);

  // const [aiTagsState, setAiTagsState] = useState([
  //   ...aiTags.filter(tag => tag.isChecked),
  // ]);
  const onItemSelect = useCallback((item, index) => {
    dispatch(updateSingleTag({...item, isChecked: !item.isChecked}));
  }, []);
  console.log('AI_TAGS', JSON.stringify(aiTags));
  let navigation = useNavigation();
  const navigateToAiTagsModal = () => {
    navigation.navigate('AiTagsFilter');
  };

  const getTags = () => {
    return aiTags ? aiTags.filter(tag => tag.isChecked) : [];
  };
  return (
    <View style={styles.sectionContainer}>
      <View style={{...styles.rowContainer, justifyContent: 'space-between'}}>
        <Text style={styles.titleText}>{title}</Text>
        <QPButton
          style={buttonStyles.textButton}
          textStyle={buttonStyles.textButtonTextPrimaryLarge}
          buttonText={getTags().length > 0 ? 'Edit' : 'Select'}
          onPress={navigateToAiTagsModal}
        />
      </View>

      <AITagsChipList
        checkedTags={getTags()}
        onItemSelect={onItemSelect}
        onCountChipPress={navigateToAiTagsModal}
        testID={testID}
      />
    </View>
  );
};

// Component for the "Show My Tickets" toggle switch
const ShowMyTicketsFilter = ({assignToId, userId, onToggle}) => {
  return (
    <View testID="render-show-tickets" style={styles.sectionContainer}>
      <View style={styles.switchContainer}>
        <Text style={styles.titleText}>{translate('only_my_tickets')}</Text>
        <Switch
          trackColor={{
            false: Colors.darkGrey,
            true: Colors.darkGrey,
          }}
          thumbColor={
            assignToId.length > 0 ? Colors.accentLight : Colors.filterIconColor
          }
          ios_backgroundColor={Colors.evenDarkerGrey}
          onValueChange={onToggle}
          value={assignToId.length > 0}
        />
      </View>
    </View>
  );
};

const ActionButtons = ({onCancel, onApply}) => {
  return (
    <View style={[styles.rowContainer, styles.buttonContainer]}>
      <QPButton
        style={[buttonStyles.outlinePrimaryButton, styles.buttonFlex]}
        buttonColor={Colors.white}
        onPress={onCancel}
        textStyle={buttonStyles.outlinePrimaryButtonText}
        buttonText={translate('clear') || 'Clear'}
      />
      <HorizontalSpaceBox multiplyBy={2} />
      <QPButton
        style={[buttonStyles.primaryButton, styles.buttonFlex]}
        buttonColor={Colors.accentLight}
        onPress={onApply}
        textStyle={buttonStyles.primaryButtonText}
        buttonText={translate('apply') || 'Apply'}
      />
    </View>
  );
};

const ItemSeparator = () => {
  return (
    <>
      <VerticalSpaceBox multiplyBy={2} />
      <ListItemSeparator style={{marginVertical: MarginConstants.tab1}} />
    </>
  );
};

const FilterTicket = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {data, onPressHandler} = route.params;
  const tags = useSelector(state => state.dashboard.ticketTags);
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [type, setType] = useState(data.type);
  const [aiTags, setAiTags] = useState(tags);
  const [assignToId, setAssignToId] = useState(data.assignToId);

  const handleStatusSelect = useCallback((item, index) => {
    setStatus(prevState =>
      prevState.map((statusItem, idx) =>
        idx === index
          ? {...statusItem, isChecked: !statusItem.isChecked}
          : statusItem,
      ),
    );
  }, []);

  const handlePrioritySelect = useCallback((item, index) => {
    setPriority(prevState =>
      prevState.map((priorityItem, idx) =>
        idx === index
          ? {...priorityItem, isChecked: !priorityItem.isChecked}
          : priorityItem,
      ),
    );
  }, []);

  const handleTypeSelect = useCallback((selectedItem, index) => {
    setType(prevState =>
      prevState.map(typeItem => ({
        ...typeItem,
        isChecked:
          typeItem.id === selectedItem.id ? !typeItem.isChecked : false,
      })),
    );
  }, []);
  // const handleAiTagsSelect = useCallback((item, index) => {
  //   setAiTags(prevState =>
  //     prevState.map((tagItem, idx) =>
  //       idx === index ? {...tagItem, isChecked: !tagItem.isChecked} : tagItem,
  //     ),
  //   );
  // }, []);

  const toggleMyTicketVisibility = useCallback(() => {
    setAssignToId(state => (state.length > 0 ? '' : data.userId));
  }, [data.userId]);

  const navigateBack = useCallback(() => {
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  }, [navigation]);
  const onApplyFilterHandler = useCallback(() => {
    const updatedData = {
      ...data,
      status,
      priority,
      type,
      assignToId,
      tags: tags.filter(tag => tag.isChecked),
    };

    onPressHandler(updatedData, 'apply');
    navigateBack();
  }, [
    data,
    status,
    priority,
    type,
    assignToId,
    onPressHandler,
    tags,
    navigateBack,
  ]);

  const resetFilterState = useCallback(
    filterArray => filterArray.map(item => ({...item, isChecked: false})),
    [],
  );

  const onCancel = useCallback(() => {
    setStatus(prevState => resetFilterState(prevState));
    setPriority(prevState => resetFilterState(prevState));
    setType(prevState => resetFilterState(prevState));
    setAssignToId(data.userId);
    dispatch(clearTagFilter());
  }, [data.userId, resetFilterState]);

  return (
    <View style={styles.container}>
      <ScrollView style={styles.innerContainer}>
        <PanelHandler />
        <View style={styles.headerContainer}>
          <TextLabel text={'Filter by'} style={styles.headerText} />
          <CloseButton onPressClose={navigateBack} />
        </View>

        <FilterSection
          title={translate('close_loop.status')}
          filterData={status}
          onItemSelect={handleStatusSelect}
          testID="render-status"
        />
        <ItemSeparator />

        <FilterSection
          title={translate('close_loop.priority')}
          filterData={priority}
          onItemSelect={handlePrioritySelect}
          testID="render-priority"
        />
        <ItemSeparator />
        <FilterSection
          title="Type"
          filterData={type}
          onItemSelect={handleTypeSelect}
          testID="render-ticket-type"
        />
        <ItemSeparator />

        <AITagsFilterSection title={'AI Tags'} testID="render-ai-tags" />
        <ItemSeparator />

        <ShowMyTicketsFilter
          assignToId={assignToId}
          userId={data.userId}
          onToggle={toggleMyTicketVisibility}
        />
        <VerticalSpaceBox multiplyBy={6} />
      </ScrollView>
      <ActionButtons onCancel={onCancel} onApply={onApplyFilterHandler} />
    </View>
  );
};

export default FilterTicket;

const styles = StyleSheet.create({
  rowContainer: {
    flexDirection: 'row',
  },
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  checkBoxRow: {
    flexDirection: 'row',
    padding: PaddingConstants.halfTab,
    alignItems: 'center',
  },
  innerContainer: {},

  container: {
    backgroundColor: Colors.white,
    flex: 1,
    paddingVertical: PaddingConstants.tab1_2x,
    paddingHorizontal: PaddingConstants.tab1,

    justifyContent: 'space-between',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingEnd: PaddingConstants.tab1,
  },
  assigneeCell: {
    borderWidth: 1,
    borderRadius: 2,
    padding: PaddingConstants.halfTab,
    borderColor: Colors.checkboxColor,
    margin: MarginConstants.halfTab,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  headerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.extraLargeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
  buttonContainer: {
    paddingHorizontal: PaddingConstants.tab1_2x,
    justifyContent: 'flex-end',
  },
  buttonFlex: {
    flex: 1,
  },
  filterListContainer: {
    flexGrow: 0,
  },
  chipContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: PaddingConstants.halfTab,
  },

  fiiledButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.white,
    backgroundColor: Colors.accentLight,
    paddingVertical: MarginConstants.tab1,
    paddingHorizontal: MarginConstants.tab2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.accentLight,
  },

  clearButtonText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.regular,
    marginHorizontal: MarginConstants.halfTab,
    color: Colors.filterIconColor,
    paddingVertical: MarginConstants.tab1,
    paddingHorizontal: MarginConstants.tab2,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.filterIconColor,
  },

  modelDropdown: {
    minHeight: MarginConstants.tab3,
    justifyContent: 'space-around',
    marginHorizontal: MarginConstants.tab1,
    paddingHorizontal: PaddingConstants.halfTab,
    borderColor: Colors.evenDarkerGrey,
    borderWidth: 1,
    borderRadius: 4,
  },
  dropdownText: {
    flex: 1,
    color: Colors.primary,
    marginVertical: MarginConstants.tab1,
    marginHorizontal: MarginConstants.halfTab,
    fontSize: Platform.isPad
      ? TextSizes.primary
      : Platform.OS === 'android'
      ? TextSizes.primary
      : TextSizes.secondary,
    textAlign: 'left',
    paddingLeft: MarginConstants.halfTab,
    paddingRight: MarginConstants.tab3,
    textAlignVertical: 'center',
    alignSelf: 'center',
    borderColor: Colors.darkerGrey,
  },
  dropdownRow: {
    flexDirection: 'row',
    minHeight: MarginConstants.tab4,
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    backgroundColor: Colors.accent,
  },
});
