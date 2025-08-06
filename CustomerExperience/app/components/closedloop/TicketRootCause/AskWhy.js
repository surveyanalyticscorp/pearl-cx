import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {MarginConstants} from '../../../styles/margin.constants';
import {TagViewItem} from './TagViewItem';

const data = [
  {
    id: 1,
    name: 'AskWhy',
  },
  {
    id: 2,
    name: 'AskWhy',
  },
];

export const AskWhy = () => {
  return (
    <View style={styles.askWhyView}>
      <TextLabel
        baseTextStyle={baseTextStyles.primaryMediumText}
        text={'AskWhy'}
      />
      <FlatList
        style={styles.flatList}
        data={data}
        horizontal
        renderItem={({item}) => <TagViewItem item={item} />}
        keyExtractor={item => item.id.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  askWhyView: {
    marginVertical: MarginConstants.tab1_2x,
    marginHorizontal: MarginConstants.tab1_2x,
  },

  flatList: {
    marginVertical: MarginConstants.tab1_2x,
  },
});
