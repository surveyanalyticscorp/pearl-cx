import React from 'react';
import {
  // useWindowDimensions,
  StyleSheet,
  Text,
  View,
  FlatList,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const ResponseFeedback = (props) => {
  const listData = props.route.params.listData;

  const rowSeparator = () => {
    return <View style={styles.rowSeparator} />;
  };

  const renderRow = ({item}) => {
    return (
      <View style={styles.itemRow}>
        <Text style={styles.question}> {item.question}</Text>
        <Text style={styles.answer}> >> {item.answer}</Text>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        style={styles.flatlist}
        data={listData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRow}
        onEndReachedThreshold={0}
        refreshing={false}
        ItemSeparatorComponent={rowSeparator}
      />
    </View>
  );
};

export default ResponseFeedback;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  flatlist: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  itemRow: {
    padding: PaddingConstants.tab1,
    margin: MarginConstants.tab1,
  },
  rowSeparator: {
    height: 1,
    backgroundColor: Colors.darkGrey,
  },
  question: {
    fontSize: TextSizes.secondary,
    fontWeight: '900',
    fontFamily: FontFamily.light,
    color: Colors.filterIconColor,
    paddingVertical: PaddingConstants.halfTab,
  },
  answer: {
    fontSize: TextSizes.semiSecondary,
    fontWeight: '900',
    fontFamily: FontFamily.light,
    color: Colors.filterIconColor,
  },
});
