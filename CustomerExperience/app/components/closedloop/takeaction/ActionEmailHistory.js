import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  FlatList,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {BottomSheetHeader, CloseButton} from '../../../routes/CommonScreen';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {ACTION_EMAIL, ASYNC_USER_CREDENTIALS} from '../../../api/Constant';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectEmailTemplate from './SelectEmailTemplate';
import {useDispatch, useSelector} from 'react-redux';
import {
  getDefaultEmailTemplate,
  getEmailTemplates,
  sendEmail,
} from '../../../redux/actions/closedloop.actions';
import StringUtils from '../../../Utils/StringUtils';
import {isObjectEmpty, showErrorFlashMessage} from '../../../Utils/Utility';
// import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';

const RenderHeader = ({subject}) => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>{subject}</Text>
      <CloseButton color={Colors.filterIconColor} />
    </View>
  );
};

const RenderTicketId = ({ticketId}) => {
  return (
    <View style={styles.ticketIdView}>
      <Text style={styles.ticketIdText}>{`Ticket ID #${ticketId}`}</Text>
    </View>
  );
};

const RenderIonIcon = ({name, size, color, style}) => {
  const color_ = Colors.filterIconColor;

  return (
    <IonIcons
      name={name}
      size={size ?? 24}
      color={color ?? color_}
      style={style}
    />
  );
};

const EmailToFrom = ({title, value}) => {
  return (
    <View>
      <View style={styles.rowContainerCenterAlign}>
        <Text style={styles.titleText}>{title}</Text>
        <Text style={styles.textInputEmail}>{value}</Text>
      </View>
      <View style={styles.devider} />
    </View>
  );
};

const EmailSubject = ({closeBottomSheet, body, onChangeSubject}) => {
  return (
    <View>
      <View style={styles.rowContainerCenterAlign}>
        <Text style={styles.titleText}>{'Subject:'}</Text>
        <TextInput
          placeholder="Email subject"
          defaultValue={body.subject ?? ''}
          style={styles.textInput}
          onChangeText={onChangeSubject}
          onFocus={closeBottomSheet}
        />
      </View>
      <View style={styles.devider} />
    </View>
  );
};

const RenderOptionsView = ({
  onPressTemplate,
  onPressAttachment,
  onPressSend,
}) => {
  return (
    <View style={styles.renderOptionView}>
      {/* {getTemplateIcon()} */}
      <TemplateIcon onPressTemplate={onPressTemplate} />
      {/* {getAttachmentIcon()} */}
      {/* {getSendIcon()} */}
      <SendIcon onPressSend={onPressSend} />
    </View>
  );
};

const SendIcon = ({onPressSend}) => {
  return (
    <Pressable onPress={onPressSend} style={styles.optionIcon}>
      <RenderIonIcon
        name={'send'}
        color={Colors.accentLight}
        style={{transform: [{rotateZ: '-45deg'}]}}
      />
    </Pressable>
  );
};

const getAttachmentIcon = () => {
  return (
    <Pressable style={styles.optionIcon}>
      <RenderIonIcon name={'attach'} />
    </Pressable>
  );
};

const TemplateIcon = ({onPressTemplate}) => {
  return (
    <Pressable onPress={onPressTemplate} style={styles.optionIcon}>
      <RenderIonIcon name={'ios-reader'} />
    </Pressable>
  );
};

const ActionHistory = ({onPressActionHistoryItem}) => {
  return (
    <View style={styles.actionHistoryContainer}>
      <Text style={styles.actionHistoryHeader}>Action History</Text>

      <ActionHistoryItem
        onItemPress={onPressActionHistoryItem}
        emailSubject={'Sample Email Subject'}
        senderName={'Amy'}
        timeStamp={'1 minute Ago'}
        totalCount={'4'}
      />
    </View>
  );
};

const ActionHistoryItem = ({
  emailBody,
  onItemPress,
  senderName,
  timeStamp,
  totalCount,
}) => {
  return (
    <Pressable style={styles.actionHistoryItemContainer}>
      <View style={styles.actionHistoryItemDetails}>
        <Text style={styles.actionHistoryUserNameText}>{senderName}</Text>
        <Text style={styles.actionHistoryDetailText}>{timeStamp}</Text>
      </View>
      <Text style={styles.actionHistoryEmailBodyText}>{emailBody}</Text>
    </Pressable>
  );
};

export default function ActionEmailHistory({subject, ticketId}) {
  const data = [
    {
      emailBody: 'Lets go sfasff sfs fsf s',
      senderName: 'Kavin',
      timeStamp: '12 minutes ago',
    },
    {
      emailBody: 'Lets go sfasff sfs fsf s',
      senderName: 'Kavin',
      timeStamp: '12 minutes ago',
    },
    {
      emailBody: 'Lets go sfasff sfs fsf s',
      senderName: 'Kavin',
      timeStamp: '12 minutes ago',
    },
    {
      emailBody: 'Lets go sfasff sfs fsf s',
      senderName: 'Kavin',
      timeStamp: '12 minutes ago',
    },
  ];

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        <RenderHeader subject={'sample subject'} />
        <FlatList
          // refreshControl={
          //   <RefreshControl onRefresh={onRefresh} refreshing={refreshing} />
          // }
          style={styles.flatList}
          data={data}
          // onEndReached={loadMoreData}
          // onEndReachedThreshold={0.25}
          // ListFooterComponent={isPagination ? <QPSpinner /> : <View />}
          // extraData={[ticketList]}
          // ListEmptyComponent={
          //   !isTicketLoading && !isPagination ? (
          //     <NoItemsFound>No tickets found</NoItemsFound>
          //   ) : (
          //     <View />
          //   )
          // }

          keyExtractor={(item, index) => index.toString()}
          renderItem={({item, index}) => {
            return (
              <ActionHistoryItem
                senderName={item.senderName}
                emailBody={item.emailBody}
                timeStamp={item.timeStamp}
                index={index}
                //   showCheckBox={showCheckBox}
                //   isSelected={selectedTickets.includes(item.id)}
                //   onPressHandler={}
                //   onLongPressHandler={() => onLongPressHandler(item, index)}
              />
            );
          }}
        />
        {/* <RenderTicketId ticketId={ticketId} /> */}
        {/* <RenderOptionsView
          onPressTemplate={onPressTemplate}
          onPressAttachment={onPressAttachment}
          onPressSend={onPressSend}
        /> */}
        {/* <RenderToTextInput />
        <RenderFromTextInput /> */}
      </KeyboardAwareScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    marginTop: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },

  innerContainer: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: MarginConstants.tab2,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: Colors.accentLight,
  },
  rowContainerCenterAlign: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  rowContainerHeader: {
    flex: 1,
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
  emailText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,

    color: Colors.filterIconColor,
  },

  textBox: {
    marginVertical: MarginConstants.tab1,

    borderColor: Colors.darkGrey,
  },

  buttonStyle: {
    backgroundColor: Colors.accentLight,
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },

  buttonTextStyle: {
    fontSize: TextSizes.secondary,
    color: Colors.white,
  },

  optionIcon: {
    margin: MarginConstants.tab1,
  },
  textInputEmail: {
    flex: 1,
    color: Colors.accentLight,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  textInput: {
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  renderOptionView: {
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab2,
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  titleText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  ticketIdView: {
    flexDirection: 'row-reverse',
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
  },
  ticketIdText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
  },
  actionHistoryContainer: {
    margin: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },

  actionHistoryItemContainer: {
    margin: MarginConstants.tab1,
    paddingTop: PaddingConstants.tab1,
  },
  actionHistoryItemDetails: {
    flex: 1,
  },
  actionHistoryHeader: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },
  actionHistoryUserNameText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.primary,
    color: Colors.filterIconColor,
  },
  actionHistoryEmailBodyText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.filterIconColor,
  },
  actionHistoryDetailText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.mediumText,
    color: Colors.filterIconColor,
  },
  devider: {
    height: 1,
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
  verticalDevider: {
    width: 1,
    flexDirection: 'row',
    backgroundColor: Colors.filterIconColor,
    marginHorizontal: MarginConstants.tab1,
    marginVertical: MarginConstants.halfTab,
  },

  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
