import React from 'react';
import {View, Text, StyleSheet, FlatList, Pressable} from 'react-native';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import useActionHandler from '../../closedloop/TicketOverview/components/useActionHandler';

const TicketTakeAction = ({onPress}) => {
  const {actionDataList} = useActionHandler();

  const renderRow = ({item, index}) => {
    return (
      <Pressable
        testID={`row-touchable-${index}`}
        onPress={() => onPress && onPress(item)}>
        <View style={styles.row}>
          <MaterialIcon
            name={item.icon}
            size={20}
            color={Colors.filterIconColor}
            testID={`row-icon-${index}`}
          />
          <Text style={styles.title} testID={`row-title-${index}`}>
            {item.title}
          </Text>
        </View>
      </Pressable>
    );
  };
  console.log('actionDataList', JSON.stringify(actionDataList));
  return (
    <View testID="take-action-container" style={styles.container}>
      <FlatList
        data={actionDataList}
        renderItem={({item, index}) => renderRow({item, index})}
        keyExtractor={item => item.id}
        testID="take-action-list"
        style={styles.flatView}
      />
    </View>
  );
};

export default TicketTakeAction;

const styles = StyleSheet.create({
  container: {
    minHeight: '30%',
    backgroundColor: Colors.white,
  },
  flatView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingVertical: PaddingConstants.tab1,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: PaddingConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1_2x,
  },
  title: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    marginStart: MarginConstants.halfTab,
    color: Colors.filterIconColor,
  },
});
