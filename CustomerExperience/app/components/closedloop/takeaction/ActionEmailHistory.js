import React, {useCallback} from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  FlatList,
  useWindowDimensions,
  Linking,
  Platform,
  SafeAreaView,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {
  Avatar,
  CloseButton,
  listItemSeparator,
} from '../../../routes/CommonScreen';
import {isObjectEmpty} from '../../../Utils/Utility';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import RenderHtml from 'react-native-render-html';
import {useSelector} from 'react-redux';
import {AttachmentIcon} from '../../../Utils/IconUtils';
import RNFetchBlob from 'rn-fetch-blob';
import {getDownloadPermissionAndroid} from '../../../Utils/PermissionUtils';
import {downloadFile} from '../../../Utils/DownloadUtils';

const RenderHeader = ({subject}) => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>{subject}</Text>
      <CloseButton color={Colors.filterIconColor} />
    </View>
  );
};

const ActionHistoryItem = ({item, index}) => {
  const emailBody = item?.emailBody ?? 'Default email body';
  const senderName = item?.emailSendBy ?? 'Default sender';
  // const actionCount = (summary?.data?.totalAction ?? 0).toString();
  const timeStamp = convertDateTimeAgo(item?.createdAt);
  return (
    <View style={styles.actionHistoryItemContainer}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <Avatar title={senderName} />
        <View style={styles.actionHistoryItemDetails}>
          <Text style={styles.actionHistoryUserNameText}>{senderName}</Text>
          <Text style={styles.actionHistoryDetailText}>{timeStamp}</Text>
        </View>
      </View>

      <EmailBody body={emailBody} />
      {item.attachments.length > 0 && <Attachment data={item.attachments} />}
    </View>
  );
};

const Attachment = ({data}) => {
  return (
    <View>
      <Text style={styles.attachmentHeaderText}>Attachments</Text>
      <FlatList
        data={data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <AttachmentItem item={item} index={index} />;
        }}
      />
    </View>
  );
};

const AttachmentItem = ({item, index}) => {
  const onPressOpenWithBrowser = useCallback(async () => {
    // const isSupported = await Linking.canOpenURL(item.path);
    // if (isSupported) {
    Linking.openURL(item.path);
    // } else {
    //   Alert.alert(`Can't open this URL: ${item.path}`);
    // }
  }, [item.path]);

  const onPressDownload = useCallback(async () => {
    if (Platform.OS === 'android') {
      getDownloadPermissionAndroid().then(granted => {
        if (granted) {
          downloadFile(item.path, item.fileName);
        }
      });
    } else {
      downloadFile(item.path, item.fileName).then(res => {
        RNFetchBlob.ios.previewDocument(res.path());
      });
    }
  }, [item.path, item.fileName]);

  return (
    <Pressable onPress={onPressDownload} style={styles.attachmentItem}>
      <AttachmentIcon mimeType={item.mimeType} />
      <Text numberOfLines={1} style={styles.attachmentText}>
        {item.fileName}
      </Text>
    </Pressable>
  );
};

// const AttachmentIcon = ({mimeType}) => {
//   const size = 12;
//   const color = Colors.accentLight;
//   if (mimeType.trim().includes('image')) {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   } else if (mimeType.trim().includes('video')) {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   } else if (mimeType.trim().includes('text')) {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   } else if (mimeType.trim().includes('audio')) {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   } else if (mimeType.trim().includes('image')) {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   } else {
//     return <FaIcon name={'file-photo-o'} size={size} color={color} />;
//   }
// };

const EmailBody = ({body}) => {
  const {width} = useWindowDimensions();
  const source = {
    html: `
  ${body}`,
  };

  return (
    <View style={styles.emailBody}>
      <RenderHtml source={source} contentWidth={width / 0.5} />
    </View>
  );
};
export default function ActionEmailHistory(props) {
  const {details, summary} = useSelector(
    state => state.dashboard.ticketActionHistory,
  );

  if (isObjectEmpty(details)) {
    return <View />;
  }

  const emailSubject = summary?.data?.action?.subject ?? 'Default subject';

  return (
    <SafeAreaView style={styles.container}>
      <RenderHeader subject={emailSubject} />
      <FlatList
        data={details.data}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <ActionHistoryItem item={item} index={index} />;
        }}
        ItemSeparatorComponent={listItemSeparator}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    marginTop: MarginConstants.tab2,
    paddingTop: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.halfTab,
  },
  rowContainerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.largeText,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  actionHistoryItemContainer: {
    margin: MarginConstants.tab1,
    padding: PaddingConstants.tab1,
  },
  actionHistoryItemDetails: {
    flex: 1,
  },
  actionHistoryUserNameText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },
  attachmentHeaderText: {
    fontFamily: FontFamily.light,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },
  actionHistoryDetailText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    color: Colors.filterIconColor,
  },
  attachmentText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    marginHorizontal: MarginConstants.halfTab,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: MarginConstants.tab2,
  },
  emailBody: {marginHorizontal: MarginConstants.tab2},
});
