import React from 'react';
import {StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {baseTextStyles} from '../../styles/text.styles';
import {getNameInitials} from '../../Utils/TicketUtils';
import {getAvatarColor} from '../../Utils/AvatarBackgroundColor';

export const Avatar = ({title, style, textStyle}) => {
  return (
    <View
      style={[
        styles.avatarView,
        {...style, backgroundColor: getAvatarColor(title ?? 'NA')},
      ]}>
      <Text
        style={[
          baseTextStyles.mediumRegularText,
          {color: Colors.white, marginHorizontal: 0, textAlign: 'center'},
          {...textStyle},
        ]}>
        {getNameInitials(title ?? 'NA')}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  avatarView: {
    flexDirection: 'row',
    borderRadius: 50,
    height: MarginConstants.tab3,
    width: MarginConstants.tab3,
    marginHorizontal: MarginConstants.halfTab,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
