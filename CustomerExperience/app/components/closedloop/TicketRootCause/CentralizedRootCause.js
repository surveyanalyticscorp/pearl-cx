import React, {useState} from 'react';
import {StyleSheet, FlatList} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Collapsible from '../CentralizedRootCause/components/CollapsableView';
import {useSelector} from 'react-redux';
import {CheckBoxItem} from '../../../routes/commonUI/CommonUI';

const RootCauseItem = ({item, index}) => {
  return (
    <Collapsible headerTitle={item.name}>
      <VerticalSpaceBox />
      {item.rcTags && item.rcTags.length > 0 ? (
        <FlatList
          style={styles.flatList}
          removeClippedSubviews={true}
          contentContainerStyle={{flexGrow: 0}}
          listKey={`rcTags-${item.id}-0`}
          data={item.rcTags}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => <TagItem item={item} />}
        />
      ) : null}

      <VerticalSpaceBox />
    </Collapsible>
  );
};

const TagItem = ({item, index}) => {
  const [isChecked, setIsChecked] = useState(false);

  if (item.rcSubTags && item.rcSubTags.length > 0) {
    return (
      <Collapsible
        isInitiallyOpen={false}
        headerTitle={item.name}
        style={styles.nestedColapsibleContainer}
        headerStyle={styles.nestedColapsibleHeader}
        leadingComponent={
          <CheckBoxItem
            textStyle={baseTextStyles.semiSecondaryRegularText}
            item={item}
            index={index}
            isChecked={isChecked}
            onPress={() => {
              setIsChecked(!isChecked);
            }}
          />
        }>
        <VerticalSpaceBox />

        <FlatList
          style={styles.flatList}
          data={item.rcSubTags}
          removeClippedSubviews={true}
          contentContainerStyle={{flexGrow: 0}}
          listKey={`rcSubTags-${item.id}-1`}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => (
            <SubTagItem item={item} index={index} />
          )}
        />

        <VerticalSpaceBox />
      </Collapsible>
    );
  }

  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      item={item}
      index={index}
      isChecked={isChecked}
      title={item.name}
      onPress={() => {
        setIsChecked(!isChecked);
      }}
    />
  );
};

const SubTagItem = ({item, index}) => {
  const [isChecked, setIsChecked] = useState(false);

  return (
    <CheckBoxItem
      textStyle={baseTextStyles.secondaryRegularText}
      item={item}
      index={index}
      isChecked={isChecked}
      title={item.name}
      onPress={() => {
        setIsChecked(!isChecked);
      }}
    />
  );
};

export const CentralizedRootCause = props => {
  const centralizedRootCauseList = useSelector(
    state => state.dashboard.centralizedRootCauseList,
  );

  console.log(
    'CENTRALIZED_ROOT_CAUSE_LIST',
    JSON.stringify(centralizedRootCauseList),
  );
  return (
    <FlatList
      style={styles.rootContainer}
      data={centralizedRootCauseList}
      removeClippedSubviews={true}
      contentContainerStyle={{flexGrow: 0}}
      listKey={`rootCauses-CentralizedRootCause`}
      renderItem={({item, index}) => (
        <RootCauseItem index={index} item={item} />
      )}
      keyExtractor={(item, index) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  rootContainer: {
    flexDirection: 'column',

    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1_2x,
  },
  flatList: {
    marginHorizontal: MarginConstants.tab1,
  },

  nestedColapsibleContainer: {
    borderRadius: 4,
    borderWidth: 1,
    borderColor: Colors.transparent,
    marginVertical: 8,
  },

  nestedColapsibleHeader: {
    flexDirection: 'row',
    alignItems: 'center',

    backgroundColor: Colors.white,
  },
});
