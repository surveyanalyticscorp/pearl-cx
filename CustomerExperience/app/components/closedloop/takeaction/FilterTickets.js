import React, {useState, useCallback} from 'react';
import {View, Text, StyleSheet, FlatList, Platform, Switch} from 'react-native';
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

// Reusable FilterSection component for displaying filter chips
const FilterSection = ({
  title,
  filterData,
  onItemSelect,
  numColumns = 4,
  testID,
}) => {
  return (
    <FlatList
      style={styles.sectionContainer}
      testID={testID}
      contentContainerStyle={styles.filterListContainer}
      ListHeaderComponent={<Text style={styles.titleText}>{title}</Text>}
      data={filterData}
      keyExtractor={(item, index) => item.toString()}
      numColumns={numColumns}
      renderItem={({item, index}) => (
        <ChipItem
          textStyle={textStyles.optionText}
          item={item}
          index={index}
          onPress={onItemSelect}
        />
      )}
    />
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

// Action buttons component
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

const FilterTicket = ({data, onPressHandler}) => {
  const [status, setStatus] = useState(data.status);
  const [priority, setPriority] = useState(data.priority);
  const [type, setType] = useState(data.type);
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

  const toggleMyTicketVisibility = useCallback(() => {
    setAssignToId(state => (state.length > 0 ? '' : data.userId));
  }, [data.userId]);

  const onApplyFilterHandler = useCallback(() => {
    const updatedData = {
      ...data,
      status,
      priority,
      type,
      assignToId,
    };
    onPressHandler(updatedData, 'apply');
  }, [data, status, priority, type, assignToId, onPressHandler]);

  const resetFilterState = useCallback(
    filterArray => filterArray.map(item => ({...item, isChecked: false})),
    [],
  );

  const onCancel = useCallback(() => {
    setStatus(prevState => resetFilterState(prevState));
    setPriority(prevState => resetFilterState(prevState));
    setType(prevState => resetFilterState(prevState));
    setAssignToId(data.userId); // Set to userId by default when canceling
  }, [data.userId, resetFilterState]);

  return (
    <View style={styles.innerContainer}>
      <FilterSection
        title={translate('close_loop.status')}
        filterData={status}
        onItemSelect={handleStatusSelect}
        numColumns={4}
        testID="render-status"
      />
      <VerticalSpaceBox multiplyBy={2} />
      <FilterSection
        title={translate('close_loop.priority')}
        filterData={priority}
        onItemSelect={handlePrioritySelect}
        numColumns={4}
        testID="render-priority"
      />
      <VerticalSpaceBox multiplyBy={2} />
      <FilterSection
        title="Type"
        filterData={type}
        onItemSelect={handleTypeSelect}
        numColumns={3}
        testID="render-ticket-type"
      />
      <VerticalSpaceBox multiplyBy={2} />
      <ShowMyTicketsFilter
        assignToId={assignToId}
        userId={data.userId}
        onToggle={toggleMyTicketVisibility}
      />
      <VerticalSpaceBox multiplyBy={6} />
      <ActionButtons onCancel={onCancel} onApply={onApplyFilterHandler} />
    </View>
  );
};

export default FilterTicket;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
  },
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
  innerContainer: {
    padding: PaddingConstants.tab1_2x,
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
