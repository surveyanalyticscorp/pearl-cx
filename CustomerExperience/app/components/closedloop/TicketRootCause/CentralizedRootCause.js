import React, {useState} from 'react';
import {
  StyleSheet,
  View,
  FlatList,
  SafeAreaView,
  Pressable,
  TextInput,
} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Collapsible from '../CentralizedRootCause/components/CollapsableView';
import {useDispatch, useSelector} from 'react-redux';
import {CheckBox, CheckBoxItem} from '../../../routes/commonUI/CommonUI';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';

function getTagCount(item) {
  return item.rcTags.reduce((acc, current) => {
    let a = current.rcSubTags.reduce((acc_, current_) => {
      return acc_ + (current_.isChecked ? 1 : 0);
    }, 0);
    return acc + (current.isChecked ? 1 : 0) + a;
  }, 0);
}

function remapRootCauseList(AllRC, assignedRC) {
  const assignedIds = new Set(assignedRC.map(item => item.id));

  const updatedAllRC = AllRC.map(rc => {
    const updatedTags = rc.rcTags.map(tag => {
      const isTagChecked = assignedIds.has(tag.id);
      const updatedSubTags = (tag.rcSubTags || []).map(subTag => {
        return {
          ...subTag,
          isChecked: assignedIds.has(subTag.id),
          isCustomerResponse: subTag.isCustomerResponse ?? false,
        };
      });

      return {
        ...tag,
        isChecked: isTagChecked,
        rcSubTags: updatedSubTags,
        isCustomerResponse: tag.isCustomerResponse ?? false,
      };
    });

    return {
      ...rc,
      rcTags: updatedTags,
    };
  });

  return updatedAllRC;
}

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
  const [tagItem, setTagItem] = useState(item);

  const updateTag = (item, index) => {
    const subTags = item.rcSubTags.map(subTag => ({
      ...subTag,
      isChecked: !item.isChecked,
    }));
    setTagItem({...item, rcSubTags: subTags, isChecked: !item.isChecked});
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
  const [isSubTagChecked, setIsSubTagChecked] = useState(isChecked);

  React.useEffect(() => {
    setIsSubTagChecked(isChecked);
  }, [isChecked]);

  const updateSubTag = (item, index) => {
    setIsSubTagChecked(prevState => !prevState);
  };
  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      style={styles.subTag}
      isChecked={isSubTagChecked}
      isDisabled={item.isCustomerResponse ?? false}
      title={item.name}
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

  const updateOtherTag = () => {
    setIsChecked(prevState => !prevState);
  };

  const updateRootCause = () => {
    console.log(isChecked, updatedText);
  };

  if (isOtherChecked) {
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
      <Pressable onPress={updateOtherTag}>
        <CheckBox isChecked={isChecked} />
      </Pressable>
      <TextInput
        placeholder="Other"
        placeholderTextColor={Colors.settingDividerColor}
        value={updatedText}
        style={styles.otherTextInput}
        onChangeText={updateOtherText}
      />
      {/* <Pressable style={styles.addButton} onPress={updateRootCause}>
        <MaterialIcons name="add" size={26} color={Colors.accentLight} />
      </Pressable> */}
    </View>
  );
};
export const CentralizedRootCause = props => {
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  const selectedTags = useSelector(
    state =>
      state.dashboard.ticket?.centralizeRootCause?.centralizeRootCauseIds ?? [],
  );

  console.log(
    'CENTRALIZED_ROOT_CAUSE_LIST',
    JSON.stringify(remapRootCauseList(centralizedRootCauseList, selectedTags)),
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <FlatList
        style={styles.flatList}
        data={remapRootCauseList(centralizedRootCauseList, selectedTags)}
        removeClippedSubviews={true}
        contentContainerStyle={{flexGrow: 0}}
        listKey={`rootCauses-CentralizedRootCause`}
        renderItem={({item, index}) => (
          <RootCauseItem index={index} item={item} />
        )}
        keyExtractor={(item, index) => item.id.toString()}
        ListFooterComponent={<OtherTag />}
      />

      <QPButton
        buttonColor={Colors.accentLight}
        testID="ApplyButton"
        style={[
          buttonStyles.primaryButton,
          {marginVertical: MarginConstants.tab2},
        ]}
        onPress={() => {
          console.log('Apply Button Pressed');
        }}
        buttonText={'Update'}
        textStyle={buttonStyles.primaryButtonText}
      />
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
  },
  otherTextInput: {
    flex: 1,
    ...baseTextStyles.primaryRegularText,
    borderBottomColor: Colors.settingDividerColor,
    borderBottomWidth: 1,
    backgroundColor: Colors.settingsBackground,
    paddingHorizontal: PaddingConstants.tab1,
  },
  otherText: {
    ...baseTextStyles.primaryRegularText,
  },
  addButton: {
    marginHorizontal: MarginConstants.tab1,
  },
});
