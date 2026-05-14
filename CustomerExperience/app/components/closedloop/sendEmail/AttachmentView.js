import React from 'react';
import {StyleSheet, Text, View, FlatList} from 'react-native';
import {useSelector} from 'react-redux';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import AttachmentItem from './AttachmentItem';

const AttachmentView = () => {
  const {mediaFileList} = useSelector(state => state.dashboard);

  if (mediaFileList && mediaFileList.length && mediaFileList.length > 0) {
    return (
      <View style={styles.attachmentContainer}>
        <Text style={styles.attachmentHeader}>Attachments</Text>
        <FlatList
          data={mediaFileList}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return <AttachmentItem item={item} index={index} />;
          }}
        />
      </View>
    );
  }
  return <View />;
};

export default AttachmentView;

const styles = StyleSheet.create({
  attachmentContainer: {
    marginHorizontal: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },
  attachmentHeader: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },
});
