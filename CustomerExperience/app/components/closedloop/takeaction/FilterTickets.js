import React, {useState, useCallback} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import ActionButtons from '../../../routes/commonUI/ActionButtons';
import {
  CloseButton,
  PanelHandler,
} from '../../../routes/commonUI/BottomSheetHeader';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import ListItemSeparator from '../../../routes/commonUI/ListItemSeparator';
import {useDispatch, useSelector} from 'react-redux';
import {clearTagFilter} from '../../../redux/actions/closedloop.actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import FilterSection from './FilterSection';
import AITagsFilterSection from './AITagsFilterSection';
import ShowMyTicketsFilter from './ShowMyTicketsFilter';

const ItemSeparator = () => (
  <>
    <VerticalSpaceBox multiplyBy={2} />
    <ListItemSeparator style={{marginVertical: MarginConstants.tab1}} />
  </>
);

const FilterTicket = ({route, navigation}) => {
  const dispatch = useDispatch();
  const {data, onPressHandler} = route.params;
  const tags = useSelector(state => state.dashboard.ticketTags);
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
  }, [data, status, priority, type, assignToId, onPressHandler, tags, navigateBack]);

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
    <SafeAreaView style={styles.container}>
      <PanelHandler />
      <View style={styles.headerContainer}>
        <TextLabel text={'Filter by'} style={styles.headerText} />
        <CloseButton onPressClose={navigateBack} />
      </View>
      <ScrollView style={styles.innerContainer}>
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

        <AITagsFilterSection title={'AI tags'} testID="render-ai-tags" />
        <ItemSeparator />

        <ShowMyTicketsFilter
          assignToId={assignToId}
          userId={data.userId}
          onToggle={toggleMyTicketVisibility}
        />
        <VerticalSpaceBox multiplyBy={6} />
      </ScrollView>
      <ActionButtons onCancel={onCancel} onApply={onApplyFilterHandler} />
    </SafeAreaView>
  );
};

export default FilterTicket;

const styles = StyleSheet.create({
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
  headerText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.extraLargeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
});
