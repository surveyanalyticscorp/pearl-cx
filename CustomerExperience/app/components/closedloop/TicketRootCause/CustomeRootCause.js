import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {MarginConstants} from '../../../styles/margin.constants';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import IconButton from '../../../routes/commonUI/IconButton';
import {MaterialIcons} from '../../../Utils/IconUtils';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {useNavigation} from '@react-navigation/core';
import {useSelector} from 'react-redux';
import {TagViewItem} from './TagViewItem';

function extractAssignedItems(AllRC, assignedRC) {
  const assignedMap = new Map();
  assignedRC.forEach(item => {
    assignedMap.set(item.id, item.isTag);
  });

  const resultMap = new Map();

  AllRC.forEach(category => {
    const categoryName = category.name;

    category.rcTags.forEach(tag => {
      const tagName = tag.name;

      // Check if tag is assigned
      if (assignedMap.has(tag.id) && assignedMap.get(tag.id) === true) {
        const title = `${categoryName}`;
        if (!resultMap.has(title)) resultMap.set(title, []);
        resultMap.get(title).push({
          id: tag.id,
          name: tag.name,
          isTag: true,
          isCustomerResponse: tag.isCustomerResponse ?? false,
        });
      }

      // Check each subtag
      (tag.rcSubTags || []).forEach(subTag => {
        if (
          assignedMap.has(subTag.id) &&
          assignedMap.get(subTag.id) === false
        ) {
          const title = `${categoryName} > ${tagName}`;
          if (!resultMap.has(title)) resultMap.set(title, []);
          resultMap.get(title).push({
            id: subTag.id,
            name: subTag.name,
            isTag: false,
            isCustomerResponse: subTag.isCustomerResponse ?? false,
          });
        }
      });
    });
  });

  // Convert resultMap to desired array format
  const finalResult = [];
  for (const [title, items] of resultMap.entries()) {
    finalResult.push({title, items});
  }

  return finalResult;
}

export const TitleAndTagsItem = ({item, index}) => {
  return (
    <View style={styles.titleAndTagsView}>
      <TextLabel baseTextStyle={baseTextStyles.semiMediumLightText}>
        {item.title}
      </TextLabel>
      <FlatList
        style={styles.tagList}
        data={item.items}
        horizontal
        removeClippedSubviews={true}
        contentContainerStyle={{flexGrow: 0}}
        listKey={`rootCauseItemList-${index}`}
        renderItem={TagViewItem}
        keyExtractor={(item, index) => index.toString()}
      />
    </View>
  );
};

export const CurrentSelectedRootCasues = () => {
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  const selectedTags = useSelector(
    state =>
      state.dashboard.ticket?.centralizeRootCause?.centralizeRootCauseIds ?? [],
  );
  return (
    <FlatList
      style={styles.flatList}
      data={extractAssignedItems(centralizedRootCauseList, selectedTags)}
      removeClippedSubviews={true}
      contentContainerStyle={{flexGrow: 0}}
      listKey={`rootCauses-Centralized-RootCause`}
      renderItem={TitleAndTagsItem}
      keyExtractor={(item, index) => item.title.toString()}
    />
  );
};

export const EditCustomRootCause = ({onPress}) => {
  return (
    <IconButton
      buttonStyle={styles.buttonStyle}
      textStyle={styles.buttonStyleText}
      leftIcon={
        <MaterialIcons name="edit" size={20} color={Colors.accentLight} />
      }
      buttonText={'Edit'}
      onPress={onPress}
    />
  );
};
export const AddCustomRootCause = ({onPress}) => {
  return (
    <View>
      <TextLabel
        baseTextStyle={baseTextStyles.secondaryLightText}
        text={'Currently, this ticket does not have any custom root causes.'}
      />
      <VerticalSpaceBox />
      <IconButton
        buttonStyle={styles.buttonStyle}
        textStyle={styles.buttonStyleText}
        leftIcon={
          <MaterialIcons name="add" size={20} color={Colors.accentLight} />
        }
        buttonText={'Add'}
        onPress={onPress}
      />
    </View>
  );
};

export const CustomRootCauseHeader = ({children}) => {
  return (
    <View style={styles.headerContainer}>
      <TextLabel
        baseTextStyle={baseTextStyles.primaryMediumText}
        text={'Custom root causes'}
      />
      {children}
    </View>
  );
};

export const CustomRootCause = () => {
  const hasRootCause = useSelector(
    state => state.dashboard.ticket?.centralizeRootCause,
  );

  const navigation = useNavigation();
  const onPress = () => {
    navigation.navigate('CentralizedRootCause');
  };

  return (
    <View style={styles.rootview}>
      <CustomRootCauseHeader>
        {hasRootCause ? <EditCustomRootCause onPress={onPress} /> : null}
      </CustomRootCauseHeader>

      {hasRootCause ? <CurrentSelectedRootCasues /> : null}
      <VerticalSpaceBox />
      {!hasRootCause ? <AddCustomRootCause onPress={onPress} /> : null}
    </View>
  );
};

const styles = StyleSheet.create({
  rootview: {
    marginVertical: MarginConstants.tab1_2x,
    marginHorizontal: MarginConstants.tab1_2x,
  },

  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    minHeight: MarginConstants.tab1_6x,
  },

  flatList: {
    marginVertical: MarginConstants.tab1,
  },
  tagList: {
    marginVertical: MarginConstants.tab1,
  },
  titleAndTagsView: {
    marginVertical: MarginConstants.tab1,
  },
  buttonStyle: {
    width: PaddingConstants.tab1_8x,
    paddingHorizontal: PaddingConstants.tab1_2x,
    height: MarginConstants.tab1_6x,
    borderRadius: 5,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonStyleText: {
    color: Colors.accentLight,
    fontSize: TextSizes.secondary2,
  },
});
