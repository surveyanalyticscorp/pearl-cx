import React from 'react';
import {View, FlatList, StyleSheet} from 'react-native';
import {baseTextStyles} from '../../../styles/text.styles';
import TextLabel from '../../../widgets/TextLabel/TextLabel';
import {PaddingConstants} from '../../../styles/padding.constants';
import {Colors} from '../../../styles/color.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const AskWhyItem = ({item}) => {
  return (
    <TextLabel
      baseTextStyle={baseTextStyles.semiSecondaryRegularText}
      style={{
        padding: PaddingConstants.tab1,
        backgroundColor: Colors.negativePromter,
      }}
      text={item.name}
    />
  );
};

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
        renderItem={({item}) => <AskWhyItem item={item} />}
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
