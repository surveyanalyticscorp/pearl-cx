import React from 'react';
import {View, Text, StyleSheet, Switch} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {translate} from '../../../Utils/MultilinguaUtils';

const ShowMyTicketsFilter = ({assignToId, userId, onToggle}) => {
  return (
    <View testID="render-show-tickets" style={styles.sectionContainer}>
      <View style={styles.switchContainer}>
        <Text style={styles.titleText}>{translate('only_my_tickets')}</Text>
        <Switch
          trackColor={{
            false: Colors.darkGrey,
            true: Colors.darkGrey,
          }}
          thumbColor={
            assignToId.length > 0 ? Colors.accentLight : Colors.filterIconColor
          }
          onValueChange={onToggle}
          value={assignToId.length > 0}
        />
      </View>
    </View>
  );
};

export default ShowMyTicketsFilter;

const styles = StyleSheet.create({
  sectionContainer: {
    paddingHorizontal: PaddingConstants.tab1,
  },
  titleText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.primary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  switchContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.tab1,
    paddingVertical: PaddingConstants.halfTab,
  },
});
