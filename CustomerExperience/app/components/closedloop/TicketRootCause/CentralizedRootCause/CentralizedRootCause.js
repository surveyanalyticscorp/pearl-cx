import React, {use, useCallback, useEffect, useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
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
import {getTagCount, getRemappedRootCauseTagList} from '../utils';
import {
  addDraftTags,
  removeDraftTags,
  resetDraftTags,
  updateCentralizedRootCause,
} from '../../../../redux/actions/closedloop.actions';
import {FontFamily} from '../../../../styles/font.constants';
import {TextSizes} from '../../../../styles/textsize.constants';
import {showErrorFlashMessage} from '../../../../Utils/Utility';

const Update = () => {
  const dispatch = useDispatch();
  const ticketId = useSelector(state => state.dashboard.ticket?.id);
  const feedbackApiKey = useSelector(
    state => state.global.userInfo?.feedbackApiKey,
  );
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses,
  );
  console.log('UPDATE', selectedRootCauses);

  const onPress = () => {
    if (
      selectedRootCauses.isOtherChecked &&
      selectedRootCauses.otherText.length <= 0
    ) {
      showErrorFlashMessage('Please enter the other text');
    } else {
      dispatch(
        updateCentralizedRootCause(
          ticketId,
          selectedRootCauses,
          feedbackApiKey,
        ),
      );
    }
    console.log('UPDATE button pressed', selectedRootCauses);
  };

  return (
    <QPButton
      buttonColor={Colors.accentLight}
      testID="ApplyButton"
      isDisabled={!selectedRootCauses.hasUpdated}
      style={[
        buttonStyles.primaryButton,
        {marginVertical: MarginConstants.tab1_2x},
      ]}
      onPress={onPress}
      buttonText={'Update'}
      textStyle={buttonStyles.primaryButtonText}
    />
  );
};

const RootCauseItem = ({item, index}) => {
  return (
    <Collapsible headerTitle={`${item.name} (${getTagCount(item)})`}>
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
  console.log('TAGITEM', item);
  const [tagItem, setTagItem] = useState(item);

  const updateTag = (item_, index) => {
    const subTags = item_.rcSubTags.map(subTag => ({
      ...subTag,
      isChecked: !item_.isChecked,
    }));
    setTagItem({...item, rcSubTags: subTags, isChecked: !item.isChecked});

    const selectedSubTags = tagItem.rcSubTags.map(subTag => ({
      id: subTag.id,
      isTag: false,
    }));

    dispatch(
      item.isChecked
        ? removeDraftTags([{id: item.id, isTag: true}, ...selectedSubTags])
        : addDraftTags([{id: item.id, isTag: true}, ...selectedSubTags]),
    );
  };
  if (tagItem.rcSubTags && tagItem.rcSubTags.length > 0) {
    return (
      <View style={[styles.tag]}>
        <CheckBoxItem
          textStyle={baseTextStyles.secondaryRegularText}
          style={styles.borderBottom}
          item={tagItem}
          index={index}
          isChecked={tagItem.isChecked}
          title={tagItem.name}
          isDisabled={tagItem.isCustomerResponse}
          onPress={updateTag}
        />
        <VerticalSpaceBox />

        {tagItem.rcSubTags.map((subTag, index_) => (
          <SubTagItem
            key={'subTag-' + index_ + subTag.id}
            item={subTag}
            index={index_}
            isChecked={subTag.isChecked}
          />
        ))}

        <VerticalSpaceBox />
      </View>
    );
  }

  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      style={styles.tag}
      item={tagItem}
      index={index}
      isChecked={tagItem.isChecked}
      title={tagItem.name}
      isDisabled={tagItem.isCustomerResponse}
      onPress={updateTag}
    />
  );
};

const SubTagItem = ({item, index, isChecked}) => {
  const [tagItem, setTagItem] = useState(item);
  const dispatch = useDispatch();
  useEffect(() => {
    setTagItem({...item, isChecked: isChecked});
  }, [isChecked]);
  const updateSubTag = (item_, index_) => {
    const tag = {id: item_.id, isTag: false};
    dispatch(item_.isChecked ? removeDraftTags([tag]) : addDraftTags([tag]));
    setTagItem({...item_, isChecked: !item_.isChecked});
  };
  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      style={styles.subTag}
      item={tagItem}
      isChecked={tagItem.isChecked}
      isDisabled={tagItem.isCustomerResponse ?? false}
      title={tagItem.name}
      onPress={updateSubTag}
    />
  );
};

export const OtherTag = () => {
  const dispatch = useDispatch();
  const {isOtherChecked, otherText} = useSelector(
    state => state.dashboard.ticket?.centralizeRootCause ?? {},
  );
  const [isChecked, setIsChecked] = useState(isOtherChecked);
  const [updatedText, updateOtherText] = useState(otherText);

  useEffect(() => {
    if (updatedText && isChecked) {
      console.log('UPDATED TEXT', updatedText, isChecked);
      dispatch(addDraftTags([], isChecked, updatedText));
    }
    dispatch(addDraftTags([], !isChecked, ''));
  }, [updatedText, isChecked]);

  const updateRootCause = () => {
    console.log(isChecked, updatedText);
  };

  if (otherText) {
    return (
      <View style={styles.otherTag}>
        <CheckBoxItem
          textStyle={styles.otherText}
          isChecked={isChecked}
          title={otherText}
          onPress={() => setIsChecked(prevState => !prevState)}
        />
      </View>
    );
  }

  return (
    <View style={styles.otherTag}>
      <Pressable onPress={() => setIsChecked(prevState => !prevState)}>
        <CheckBox isChecked={isChecked} />
      </Pressable>
      <TextInput
        placeholder="Other"
        placeholderTextColor={Colors.settingDividerColor}
        value={updatedText}
        style={styles.otherTextInput}
        onChangeText={text => {
          updateOtherText(text);
          setIsChecked(true);
        }}
      />
      {/* <Pressable style={styles.addButton} onPress={updateRootCause}>
        <MaterialIcons name="add" size={26} color={Colors.accentLight} />
      </Pressable> */}
    </View>
  );
};
export const CentralizedRootCause = props => {
  const dispatch = useDispatch();
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  const selectedTags = useSelector(
    state =>
      state.dashboard.ticket?.centralizeRootCause?.centralizeRootCauseIds ?? [],
  );
  const selectedRootCauses = useSelector(
    state => state.dashboard.selectedRootCauses.centralizeRootCauseIds ?? [],
  );
  console.log(
    'CENTRALIZED_ROOT_CAUSE_LIST',
    JSON.stringify(
      getRemappedRootCauseTagList(centralizedRootCauseList, selectedTags),
    ),
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <FlatList
        style={styles.flatList}
        data={getRemappedRootCauseTagList(
          centralizedRootCauseList,
          selectedRootCauses,
        )}
        removeClippedSubviews={true}
        contentContainerStyle={{flexGrow: 0}}
        listKey={`rootCauses-CentralizedRootCause`}
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
    borderBottomColor: Colors.settingDividerColor,
    borderBottomWidth: 2,
    backgroundColor: Colors.settingsBackground,
    borderBottomStartRadius: 4,
    borderTopEndRadius: 4,
  },
  otherText: {
    ...baseTextStyles.primaryRegularText,
  },
  addButton: {
    marginHorizontal: MarginConstants.tab1,
  },
});
