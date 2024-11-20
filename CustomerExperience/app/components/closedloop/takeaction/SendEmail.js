import React, {useEffect, useCallback, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  FlatList,
  Keyboard,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {CloseButton} from '../../../routes/commonUI/CommonUI';
import BottomSheetHeader from '../../../routes/commonUI/BottomSheetHeader';
import Animated from 'react-native-reanimated';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectEmailTemplate from './SelectEmailTemplate';
import {useDispatch, useSelector} from 'react-redux';
import {
  getActionHistoryDetails,
  getActionHistorySummary,
  getDefaultEmailTemplate,
  getEmailTemplates,
  postUploadFile,
  sendEmail,
} from '../../../redux/actions/closedloop.actions';
import StringUtils from '../../../Utils/StringUtils';
import {isObjectEmpty, showErrorFlashMessage} from '../../../Utils/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import DocumentPicker from 'react-native-document-picker';
import {isNull} from 'lodash';
import {AttachmentIcon} from '../../../Utils/IconUtils';
import {translate} from '../../../Utils/MultilinguaUtils';

export const RenderHeader = () => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>Respond via email</Text>
      <CloseButton color={Colors.filterIconColor} />
    </View>
  );
};

export const RenderTicketId = () => {
  const id = useSelector(state => state.dashboard.ticket.id);

  return (
    <View style={styles.ticketIdView}>
      <Text style={styles.ticketIdText}>{`${translate(
        'ticket_overview.ticket_id',
      )} #${id}`}</Text>
    </View>
  );
};

export const RenderIonIcon = ({name, size, color, style}) => {
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

export const EmailToFrom = ({title, value}) => {
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

export const EmailSubject = ({closeBottomSheet, body, onChangeSubject}) => {
  return (
    <View>
      <View style={styles.rowContainerCenterAlign}>
        <Text style={styles.titleText}>{`${translate(
          'action_email.subject',
        )}:`}</Text>
        <TextInput
          multiline={false}
          placeholder="Email subject"
          placeholderTextColor={Colors.borderColor}
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

export const RenderOptionsView = ({
  onPressTemplate,
  emailBody,
  onPressSend,
}) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        flex: 1,
        marginTop: MarginConstants.tab1,
        marginBottom: MarginConstants.halfTab,
      }}>
      <RenderTicketId />
      <View style={styles.renderOptionView}>
        <TemplateIcon onPressTemplate={onPressTemplate} />
        <AttachmentUploadIcon />
        <SendIcon emailBody={emailBody} />
      </View>
    </View>
  );
};

export const SendIcon = ({emailBody}) => {
  const {mediaFileList} = useSelector(state => state.dashboard);
  const dispatch = useDispatch();

  console.log('EMAIL BODY: 1', JSON.stringify(emailBody));
  console.log('ATTACHMENTS: 1', JSON.stringify(mediaFileList));

  const callSendEmailApi = () => {
    let attachments = [];
    // const queryParam = {
    //   subscriberId: global.subscriberId,
    //   emailAddress: userInfo.emailAddress,
    // };
    if (mediaFileList.length > 0) {
      for (let i = 0; i < mediaFileList.length; i++) {
        attachments[i] = mediaFileList[i].id;
      }
    }
    if (StringUtils.isEmpty(emailBody.subject)) {
      showErrorFlashMessage('Empty email subject');
      return;
    }
    if (StringUtils.isEmpty(emailBody.emailBody)) {
      showErrorFlashMessage('Empty email body');
      return;
    } else {
      console.log('EMAIL BODY: 2', JSON.stringify(emailBody));
      console.log('ATTACHMENTS: 2', JSON.stringify(attachments));

      dispatch(
        sendEmail(
          '',
          emailBody.ticketId,
          {...emailBody, attachments: attachments},
          // queryParam,
        ),
      );
      // props.navigation.goBack();
    }
  };

  const onPressSend = useCallback(() => {
    callSendEmailApi();
  }, [emailBody, mediaFileList]);

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

export const AttachmentUploadIcon = () => {
  const dispatch = useDispatch();
  const onPressAttachment = useCallback(async () => {
    console.log('Attach items');

    try {
      const response = await DocumentPicker.pickSingle({
        presentationStyle: 'fullScreen',
        type: [DocumentPicker.types.allFiles],
      });

      console.log(JSON.stringify(response));

      const formData = new FormData();
      formData.append('mediaType', '1');
      formData.append('file', {
        uri: response.uri,
        type: response.type,
        name: response.name,
      });
      dispatch(postUploadFile(formData));
    } catch (err) {
      console.warn(err);
    }
  }, []);

  return (
    <Pressable onPress={onPressAttachment} style={styles.optionIcon}>
      <RenderIonIcon name={'attach'} />
    </Pressable>
  );
};

export const TemplateIcon = ({onPressTemplate}) => {
  return (
    <Pressable onPress={onPressTemplate} style={styles.optionIcon}>
      <RenderIonIcon name={'ios-reader'} />
    </Pressable>
  );
};

export const ActionHistory = ({onPressActionHistoryItem}) => {
  return (
    <View style={styles.actionHistoryContainer}>
      <Text style={styles.actionHistoryHeader}>Action history</Text>

      <ActionHistoryItem onItemPress={onPressActionHistoryItem} />
    </View>
  );
};
export const AttachmentView = ({onPressActionHistoryItem}) => {
  const {mediaFileList} = useSelector(state => state.dashboard);
  console.log(
    'ATTACHEMENTS_LIST',
    JSON.stringify(JSON.stringify(mediaFileList)),
  );
  return (
    <View style={styles.attachmentContainer}>
      <Text style={styles.actionHistoryHeader}>Attachments</Text>
      <FlatList
        data={mediaFileList}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({item, index}) => {
          return <AttachmentItem item={item} index={index} />;
        }}
      />
    </View>
  );
};

export const AttachmentItem = ({item, index}) => {
  return (
    <Pressable style={styles.attachmentItem}>
      <AttachmentIcon mimeType={item.mimeType} />
      <Text numberOfLines={1} style={styles.attachmentText}>
        {StringUtils.truncateFileName(item.fileName)}
      </Text>
    </Pressable>
  );
};

export const NoActionView = () => {
  return (
    <View>
      <Text style={[styles.actionHistoryDetailText, {fontStyle: 'italic'}]}>
        No action has taken yet
      </Text>
    </View>
  );
};

export const ActionHistoryItem = ({onItemPress}) => {
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);
  const actionDetails = summary?.data?.action ?? null;
  console.log('SUMMARY OS', JSON.stringify(summary));

  if (isNull(actionDetails)) {
    return <NoActionView />;
  }
  const emailSubject = summary?.data?.action?.subject ?? 'Default subject';
  const senderName = summary?.data?.action?.emailSendBy ?? 'Default sender';
  const actionCount = (summary?.data?.totalAction ?? 0).toString();
  const timeStamp = convertDateTimeAgo(summary?.data?.action?.createdAt);
  return (
    <Pressable onPress={onItemPress} style={styles.actionHistoryItemContainer}>
      <Text style={styles.actionHistorySubjectText}>{emailSubject}</Text>
      <View style={styles.actionHistoryItemDetails}>
        <Text style={styles.actionHistoryDetailText}>by: </Text>
        <Text style={[styles.actionHistoryDetailText, {fontStyle: 'italic'}]}>
          {senderName}
        </Text>

        <View style={styles.verticalDevider} />
        <Text style={styles.actionHistoryDetailText}>{timeStamp}</Text>
        <View style={styles.verticalDevider} />
        <Text
          style={
            styles.actionHistoryDetailText
          }>{`total actions: ${actionCount}`}</Text>
      </View>
    </Pressable>
  );
};

export const CustomKeyboardToolbar = ({toolbarRef, richTextfieldRef}) => {
  return (
    <View style={styles.toolbarContainer}>
      <RichToolbar
        ref={toolbarRef}
        editor={richTextfieldRef}
        selectedIconTint={Colors.accentLight}
        iconTint={Colors.lightBlack}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          actions.insertBulletsList,
          actions.insertOrderedList,
          actions.setStrikethrough,
        ]}
        style={styles.richToolbar}
      />
    </View>
  );
};

export const SendEmail = props => {
  const defaultEmail = useSelector(
    state => state.dashboard.emailData.defaultTemplate,
  );
  const {emailSentResponse} = useSelector(state => state.dashboard.emailData);
  const ticketId = JSON.stringify(props.route.params.ticketId);
  const sampleEmailBody = {
    ticketId: JSON.stringify(props.route.params.ticketId),
    subject: '',
    toEmail: props.route.params.toEmail ?? '',
    emailBody: '',
    attachments: [],
  };
  const [body, setBody] = useState(sampleEmailBody);
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const richText = React.useRef();
  const richTextToolBar = React.useRef();
  const templateList = useSelector(
    state => state.dashboard.emailData.emailTemplates,
  );

  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['33%', '0%'];

  const closeBottomSheet = () => {
    bs.current.snapTo(bsSnapPoints.length - 1);
  };

  useEffect(() => {
    if (!isObjectEmpty(defaultEmail)) {
      setBody(state => ({
        ...state,
        emailBody: defaultEmail?.templateText ?? '',
      }));

      richText.current.setContentHTML(defaultEmail?.templateText ?? '');
    }
  }, [defaultEmail]);

  useEffect(() => {
    dispatch(
      getDefaultEmailTemplate(authToken, {subscriberId: global.subscriberId}),
    );
    dispatch(getEmailTemplates(authToken, {subscriberId: global.subscriberId}));
  }, []);
  useEffect(() => {
    dispatch(getActionHistorySummary(authToken, ticketId));
    dispatch(getActionHistoryDetails(authToken, ticketId));
    setBody(sampleEmailBody);
    richText.current.setContentHTML('');
  }, [emailSentResponse]);

  const onPressActionHistoryItem = useCallback(() => {
    console.log('on Press action history Item');
    props.navigation.navigate('actionEmailHistory', {
      ticketId: ticketId,
    });
  }, []);

  const onPressTemplate = useCallback(() => {
    richText.current.dismissKeyboard();
    bs.current.snapTo(0);
    console.log('call');
  }, []);

  const onChangeSubject = text => {
    setBody(state => ({...state, subject: text}));
  };

  const onChangeEmailBody = text => {
    setBody(state => ({...state, emailBody: text}));
  };
  const handleTemplateSelectAction = item => {
    setBody(state => ({
      ...state,
      emailBody: item.templateText,
    }));

    richText.current.setContentHTML(item.templateText);
    closeBottomSheet();
  };

  const renderSelectTemplate = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectEmailTemplate
          data={templateList}
          handleOnPress={item => handleTemplateSelectAction(item)}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={'Select Template'}
        onPressClose={closeBottomSheet}
      />
    );
  };

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardVisible(true);
      },
    );

    const keyboardDidHideListener = Keyboard.addListener(
      'keyboardDidHide',
      () => {
        setKeyboardVisible(false);
      },
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true}>
        <RenderHeader />

        <RenderOptionsView onPressTemplate={onPressTemplate} emailBody={body} />

        <EmailToFrom
          title={translate('action_email.to')}
          value={body.toEmail}
        />
        <EmailSubject
          body={body}
          closeBottomSheet={closeBottomSheet}
          onChangeSubject={onChangeSubject}
        />
        <RichEditor
          ref={richText}
          useContainer
          disabled={false}
          initialFocus={false}
          onChange={onChangeEmailBody}
          placeholder={translate('action_email.email_body')}
          placeholderTextColor={Colors.borderColor}
          androidHardwareAccelerationDisabled={true}
          initialHeight={300}
          style={styles.textInput}
          setContentHTML={body.emailBody}
          onFocus={closeBottomSheet}
        />

        <AttachmentView />
        <ActionHistory onPressActionHistoryItem={onPressActionHistoryItem} />
      </KeyboardAwareScrollView>

      <BottomSheet
        ref={bs}
        snapPoints={bsSnapPoints}
        initialSnap={bsSnapPoints.length - 1}
        enabledGestureInteraction={true}
        renderContent={renderSelectTemplate}
        renderHeader={renderHeader}
        callbackNode={fall}
      />
      {isKeyboardVisible && (
        <CustomKeyboardToolbar
          toolbarRef={richTextToolBar}
          richTextfieldRef={richText}
        />
      )}
    </View>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    marginTop: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
    paddingHorizontal: PaddingConstants.tab1_2x,
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
    color: Colors.accent,
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
  toolbarContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#fff', // Adjust background color to match the keyboard
    elevation: 10, // Adds shadow on Android
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2}, // Adds shadow on iOS
    shadowOpacity: 0.3,
    shadowRadius: 3.84,
  },
  richToolbar: {
    justifyContent: 'center',
    alignItems: 'flex-start',
    paddingHorizontal: PaddingConstants.tab1_2x,
    paddingBottom: PaddingConstants.halfTab,

    height: MarginConstants.tab1_8x,
    backgroundColor: Colors.settingsBackground,
  },
  renderOptionView: {
    flex: 2,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  titleText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },
  ticketIdView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
  },
  ticketIdText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.evenDarkerGrey,
  },
  actionHistoryContainer: {
    margin: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },

  attachmentContainer: {
    marginHorizontal: MarginConstants.tab2,
    paddingTop: PaddingConstants.tab1,
  },

  actionHistoryItemContainer: {
    margin: MarginConstants.tab1,
    paddingTop: PaddingConstants.tab1,
  },
  actionHistoryItemDetails: {
    flex: 1,
    flexDirection: 'row',
  },
  actionHistoryHeader: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.largeText,
    color: Colors.filterIconColor,
  },
  actionHistorySubjectText: {
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
  attachmentText: {
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
    marginHorizontal: MarginConstants.halfTab,
  },
  attachmentItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
