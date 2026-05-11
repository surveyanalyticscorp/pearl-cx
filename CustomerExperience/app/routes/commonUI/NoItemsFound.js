import React from 'react';
import {Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {FontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';

export const NoItemsFound = ({children}) => {
  return (
    <View
      testID="no-activity"
      style={{
        flex: 1,
        margin: MarginConstants.tab3,
      }}>
      <Text
        style={{
          fontFamily: FontFamily.medium,
          color: Colors.filterIconColor,
          fontSize: TextSizes.primary,
        }}>
        {children ?? 'No items found'}
      </Text>
    </View>
  );
};
