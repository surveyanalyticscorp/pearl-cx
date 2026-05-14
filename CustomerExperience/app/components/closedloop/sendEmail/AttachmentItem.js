import React from 'react';
import {StyleSheet, Text, View, Pressable} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {AttachmentIcon, IonIcon} from '../../../Utils/IconUtils';
import StringUtils from '../../../Utils/StringUtils';

const AttachmentItem = ({item}) => {
  return (
    <Pressable style={styles.attachmentItem}>
      <AttachmentIcon mimeType={item.mimeType} />
      <Text numberOfLines={1} style={styles.attachmentText}>
        {StringUtils.truncateFileName(item.fileName)}
      </Text>
      <Pressable style={styles.alignSelfEnd} onPress={() => {}}>
        <IonIcon name="close" size={20} color={Colors.filterIconColor} />
      </Pressable>
    </Pressable>
  );
};

export default AttachmentItem;

const styles = StyleSheet.create({
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  attachmentText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    marginHorizontal: MarginConstants.halfTab,
  },
  alignSelfEnd: {
    alignSelf: 'flex-end',
  },
});
