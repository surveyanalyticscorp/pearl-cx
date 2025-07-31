import React from 'react';
import {View, StyleSheet, FlatList} from 'react-native';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {baseTextStyles} from '../../../styles/text.styles';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import Collapsible from '../CentralizedRootCause/components/CollapsableView';
import {useSelector} from 'react-redux';

const RootCauseItem = ({item}) => {
  return (
    <Collapsible headerTitle={item.name}>
      <VerticalSpaceBox />
      {item.rcTags && item.rcTags.length > 0 ? (
        <FlatList
          style={styles.flatList}
          listKey={`rcTags-${item.name}-0`}
          data={item.rcTags}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => <TagItem item={item} />}
        />
      ) : null}

      <VerticalSpaceBox />
    </Collapsible>
  );
};

const TagItem = ({item}) => {
  return (
    <View>
      <TextLabel
        baseTextStyle={baseTextStyles.semiSecondaryRegularText}
        text={item.name}
      />
      <VerticalSpaceBox />
      {item.rcSubTags && item.rcSubTags.length > 0 ? (
        <FlatList
          style={styles.flatList}
          data={item.rcSubTags}
          listKey={`rcSubTags-${item.name}-1`}
          keyExtractor={(item, index) => item.id.toString()}
          renderItem={({item, index}) => <SubTagItem item={item} />}
        />
      ) : null}

      <VerticalSpaceBox />
    </View>
  );
};

const SubTagItem = ({item}) => {
  return (
    <TextLabel
      baseTextStyle={baseTextStyles.semiSecondaryRegularText}
      text={item.name}
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
      listKey={`rootCauses-CentralizedRootCause`}
      renderItem={({item, index}) => <RootCauseItem item={item} />}
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
    marginHorizontal: MarginConstants.tab1_6x,
  },
});
