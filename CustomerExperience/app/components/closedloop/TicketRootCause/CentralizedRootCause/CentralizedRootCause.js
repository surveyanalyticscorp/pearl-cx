import React, {useEffect, useState} from 'react';
import {StyleSheet, View, FlatList, Pressable, TextInput} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {baseTextStyles} from '../../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../../widgets/SpaceBox';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import Collapsible from '../../CentralizedRootCause/components/CollapsableView';
import {useDispatch, useSelector} from 'react-redux';
import {CheckBox, CheckBoxItem} from '../../../../routes/commonUI/CommonUI';
import QPButton from '../../../../widgets/Button';
import {buttonStyles} from '../../../../styles/button.styles';
import {isTagChecked, getTagCountFromSelectedList} from '../utils';
import {
  addDraftTags,
  removeDraftTags,
  updateCentralizedRootCause,
} from '../../../../redux/actions/closedloop.actions';
import {FontFamily} from '../../../../styles/font.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {showErrorFlashMessage} from '../../../../Utils/Utility';
import {useNavigation} from '@react-navigation/native';

const validateOtherText = selectedRootCauses => {
  return !(
    selectedRootCauses.isOtherChecked &&
    selectedRootCauses.otherText.length <= 0
  );
};
const Update = () => {
  const dispatch = useDispatch();
  const ticketId = useSelector(state => state.dashboard.ticket?.id);
  const feedbackApiKey = useSelector(
    state => state.global.userInfo?.feedbackApiKey,
  );
  const navigation = useNavigation();
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses,
  );

  const handleUpdate = () => {
    dispatch(
      updateCentralizedRootCause(ticketId, selectedRootCauses, feedbackApiKey),
    );
    if (navigation.canGoBack()) {
      navigation.goBack();
    }
  };

  const onPress = () => {
    // console.log('onPress UPDATE', selectedRootCauses);

    if (!validateOtherText(selectedRootCauses)) {
      showErrorFlashMessage('Please enter the other text');
      return;
    }

    handleUpdate();
    // console.log('UPDATE button pressed', selectedRootCauses);
  };

  return (
    <QPButton
      testID="ApplyButton"
      isDisabled={!selectedRootCauses.hasUpdated}
      style={[
        selectedRootCauses.hasUpdated
          ? buttonStyles.primaryButtonRadius
          : buttonStyles.disableButton,
        {marginVertical: MarginConstants.tab1_2x},
      ]}
      onPress={onPress}
      buttonText={'Update'}
      textStyle={buttonStyles.primaryButtonText}
    />
  );
};

const RootCauseItem = ({item, index}) => {
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses.centralizeRootCauseIds ?? [],
  );

  return (
    <Collapsible
      headerTitle={`${item.name} (${getTagCountFromSelectedList(
        selectedRootCauses,
        item,
      )})`}>
      <VerticalSpaceBox />
      {item.rcTags && item.rcTags.length > 0
        ? item.rcTags.map((tag, index_) => (
            <TagItem key={'tag-' + index_ + tag.id} item={tag} index={index_} />
          ))
        : null}

      <VerticalSpaceBox />
    </Collapsible>
  );
};

const TagItem = ({item, index}) => {
  const dispatch = useDispatch();
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses.centralizeRootCauseIds ?? [],
  );

  const [isChecked, setIsChecked] = useState(
    isTagChecked(selectedRootCauses, item.id),
  );
  // const [tagItem, setTagItem] = useState(item);
  useEffect(() => {
    setIsChecked(isTagChecked(selectedRootCauses, item.id));
  }, [selectedRootCauses, item]);
  const updateTag = (tagItem, tagIndex) => {
    const selectedSubTags = tagItem.rcSubTags.map(subTag => ({
      id: subTag.id,
      isTag: false,
    }));

    const tagsToUpdate = [{id: item.id, isTag: true}, ...selectedSubTags];
    const action = isChecked ? removeDraftTags : addDraftTags;

    dispatch(action(tagsToUpdate));
  };
  if (item.rcSubTags && item.rcSubTags.length > 0) {
    return (
      <View style={[styles.tag]}>
        <CheckBoxItem
          textStyle={{
            color: Colors.filterIconColor,
            ...baseTextStyles.secondaryRegularText,
          }}
          style={styles.borderBottom}
          item={item}
          index={index}
          isChecked={isChecked}
          title={item.name}
          isDisabled={item.isCustomerResponse ?? false}
          onPress={updateTag}
        />
        <VerticalSpaceBox />

        {item.rcSubTags.map((subTag, index_) => (
          <SubTagItem
            key={'subTag-' + index_ + subTag.id}
            item={subTag}
            index={index_}
          />
        ))}

        <VerticalSpaceBox />
      </View>
    );
  }

  return (
    <CheckBoxItem
      textStyle={{
        color: Colors.filterIconColor,
        ...baseTextStyles.secondaryRegularText,
      }}
      style={styles.tag}
      item={item}
      index={index}
      isChecked={isChecked}
      title={item.name}
      isDisabled={item.isCustomerResponse ?? false}
      onPress={updateTag}
    />
  );
};

const SubTagItem = ({item, index}) => {
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses.centralizeRootCauseIds ?? [],
  );
  const isChecked = isTagChecked(selectedRootCauses, item.id);
  const dispatch = useDispatch();

  const updateSubTag = (item_, index_) => {
    const tag = {id: item_.id, isTag: false};
    const action = isChecked ? removeDraftTags : addDraftTags;
    dispatch(action([tag]));
  };
  return (
    <CheckBoxItem
      textStyle={{
        color: Colors.filterIconColor,
        ...baseTextStyles.secondaryRegularText,
      }}
      style={styles.subTag}
      item={item}
      isChecked={isChecked}
      isDisabled={item?.isCustomerResponse ?? false}
      title={item.name}
      onPress={updateSubTag}
    />
  );
};

export const OtherTag = () => {
  const dispatch = useDispatch();
  const preDefienedOtherText = useSelector(
    state => state.dashboard.ticket?.centralizeRootCause?.otherText,
  );
  const isOtherChecked = useSelector(
    state => state.dashboard.selectedRootCauses.isOtherChecked ?? false,
  );
  const otherText = useSelector(
    state => state.dashboard.selectedRootCauses.otherText ?? '',
  );

  console.log('otherTag', isOtherChecked, otherText);

  const toggleOtherSelection = () => {
    const newCheckedState = !isOtherChecked;
    console.log(newCheckedState, otherText);
    dispatch(addDraftTags([], newCheckedState, otherText));
  };

  const updateOtherText = text => {
    dispatch(addDraftTags([], text?.length > 0, text));
  };

  if (preDefienedOtherText) {
    return (
      <View style={styles.otherTag}>
        <CheckBoxItem
          textStyle={styles.otherText}
          isChecked={isOtherChecked}
          title={otherText}
          onPress={toggleOtherSelection}
        />
      </View>
    );
  }

  return (
    <View style={styles.otherTag}>
      <Pressable onPress={toggleOtherSelection}>
        <CheckBox isChecked={isOtherChecked} />
      </Pressable>
      <TextInput
        placeholder="Other"
        placeholderTextColor={Colors.settingDividerColor}
        value={otherText}
        style={styles.otherTextInput}
        onChangeText={updateOtherText}
      />
    </View>
  );
};
export const CentralizedRootCause = props => {
  // const dispatch = useDispatch();
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  // const selectedTags = useSelector(
  //   state =>
  //     state.dashboard.ticket?.centralizeRootCause?.centralizeRootCauseIds ?? [],
  // );
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses.centralizeRootCauseIds ?? [],
  );
  console.log(
    'CENTRALIZED_ROOT_CAUSE_LIST',
    JSON.stringify(selectedRootCauses),
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <FlatList
        style={styles.flatList}
        data={centralizedRootCauseList}
        contentContainerStyle={styles.flatListContent}
        listKey={'rootCauses-CentralizedRootCause'}
        renderItem={({item, index}) => (
          <RootCauseItem index={index} item={item} />
        )}
        keyExtractor={(item, index) => item.id.toString()}
        ListFooterComponent={<OtherTag />}
      />

      <Update />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flex: 1,
    flexDirection: 'column',
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
  },
  flatList: {
    flex: 1,
    marginHorizontal: MarginConstants.tab1,
  },
  flatListContent: {
    flexGrow: 0,
  },

  tag: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.settingsBackground,
    paddingVertical: PaddingConstants.tab1,
    marginHorizontal: MarginConstants.tab1_2x,
    marginVertical: MarginConstants.tab1,
  },
  subTag: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.transparent,
    marginStart: MarginConstants.tab1_4x,
  },
  otherTagCheckbox: {
    marginStart: MarginConstants.tab1,
  },
  borderBottom: {
    paddingBottom: PaddingConstants.tab1,
    borderBottomColor: Colors.settingsBackground,
    borderBottomWidth: 1,
  },
  otherTag: {
    marginTop: MarginConstants.tab1,
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    borderColor: Colors.transparent,
    borderWidth: 1,
  },
  otherTextInput: {
    flex: 1,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
    borderBottomColor: Colors.settingDividerColor,
    borderBottomWidth: 2,
    backgroundColor: Colors.settingsBackground,
    borderBottomStartRadius: 4,
    borderTopEndRadius: 4,
    height: PaddingConstants.tab1_6x,
  },
  otherText: {
    ...baseTextStyles.primaryRegularText,
  },
  addButton: {
    marginHorizontal: MarginConstants.tab1,
  },
});
