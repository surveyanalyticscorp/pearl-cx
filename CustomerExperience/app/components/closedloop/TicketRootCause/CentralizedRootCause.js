import React, {useState} from 'react';
import {StyleSheet, View, FlatList, SafeAreaView} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Collapsible from '../CentralizedRootCause/components/CollapsableView';
import {useSelector} from 'react-redux';
import {CheckBoxItem} from '../../../routes/commonUI/CommonUI';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';

function markAssignedRC(AllRC, assignedRC) {
  const assignedIds = new Set(assignedRC.map(item => item.id));

  const updatedAllRC = AllRC.map(rc => {
    const updatedTags = rc.rcTags.map(tag => {
      const isTagChecked = assignedIds.has(tag.id);
      const updatedSubTags = (tag.rcSubTags || []).map(subTag => {
        return {
          ...subTag,
          isChecked: assignedIds.has(subTag.id),
        };
      });

      return {
        ...tag,
        isChecked: isTagChecked,
        rcSubTags: updatedSubTags,
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
    <Collapsible headerTitle={item.name}>
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
    setTagItem(prevState => {
      return {...prevState, isChecked: !prevState.isChecked};
    });
  };
  if (item.rcSubTags && item.rcSubTags.length > 0) {
    return (
      <View style={[styles.tag]}>
        <CheckBoxItem
          textStyle={baseTextStyles.secondaryRegularText}
          style={styles.borderBottom}
          item={tagItem}
          index={index}
          isChecked={tagItem.isChecked}
          title={tagItem.name}
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
      textStyle={baseTextStyles.secondaryRegularText}
      style={styles.tag}
      item={tagItem}
      index={index}
      isChecked={tagItem.isChecked}
      title={tagItem.name}
      onPress={updateTag}
    />
  );
};

const SubTagItem = ({item, index}) => {
  const [subTagItem, setSubTagItem] = useState(item);

  const updateSubTag = (item, index) => {
    setSubTagItem(prevState => {
      return {...prevState, isChecked: !prevState.isChecked};
    });
  };
  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      style={styles.subTag}
      item={subTagItem}
      index={index}
      isChecked={subTagItem.isChecked}
      title={subTagItem.name}
      onPress={updateSubTag}
    />
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
    JSON.stringify(markAssignedRC(centralizedRootCauseList, selectedTags)),
  );

  return (
    <SafeAreaView style={styles.rootContainer}>
      <FlatList
        style={styles.flatList}
        data={markAssignedRC(centralizedRootCauseList, selectedTags)}
        removeClippedSubviews={true}
        contentContainerStyle={{flexGrow: 0}}
        listKey={`rootCauses-CentralizedRootCause`}
        renderItem={({item, index}) => (
          <RootCauseItem index={index} item={item} />
        )}
        keyExtractor={(item, index) => item.id.toString()}
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
  borderBottom: {
    paddingBottom: PaddingConstants.tab1,
    borderBottomColor: Colors.settingsBackground,
    borderBottomWidth: 1,
  },
});
