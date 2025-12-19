import React, {useEffect, useState} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  FlatList,
  Platform,
  Keyboard,
  Modal,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {CloseButton} from '../../../routes/commonUI/CommonUI';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import SelectEmailTemplate from './SelectEmailTemplate';
import {useDispatch, useSelector} from 'react-redux';
import {
  getActionHistoryDetails,
  getActionHistorySummary,
  resetSendEmailResponse,
} from '../../../redux/actions/closedloop.actions';
import StringUtils from '../../../Utils/StringUtils';
import {isObjectEmpty} from '../../../Utils/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import {isNull} from 'lodash';
import {
  AttachmentIcon,
  IonIcon,
  MaterialCommunityIcons,
  MaterialIcons,
} from '../../../Utils/IconUtils';
import {translate} from '../../../Utils/MultilinguaUtils';
import {useNavigation} from '@react-navigation/native';
import SendEmailTo from './sendEmail/SendEmailTo';
import EmailOptions from './sendEmail/EmailOptions';
import AIEmailDraftModal from './AIEmailDraftModal';
import {FontFamilyStylesheet} from '../../../config/fonts/StyleSheet';
import QPBottomSheet from '../takeaction/QPBottomSheet';
import QPBottomSheetHeader from '../takeaction/QPBottomSheetHeader';
import {buttonStyles} from '../../../styles/button.styles';
import InsertLinkModal from './InsertLinkModal';
import GestureHandleBar from '../../../routes/commonUI/GestureHandleBar';
import {VerticalSpaceBox} from '../../../widgets/SpaceBox';

const INSERT_LINK = 'customInsertLink';

// // dummy function to simulate inserting a link into the editor
// const insertLinkIEditor = (title, url) => {
//   console.log('insertLinkIEditor called with:', {title, url});
// };

export const RenderHeader = () => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>Respond via email</Text>
      <CloseButton color={Colors.filterIconColor} />
    </View>
  );
};

export const EmailSubject = ({body, onChangeSubject}) => {
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
        />
      </View>
      <View style={styles.devider} />
    </View>
  );
};

export const ActionHistory = ({children}) => {
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);

  if (!isNull(summary?.data?.action)) {
    return (
      <View style={styles.actionHistoryContainer}>
        <Text style={styles.actionHistoryHeader}>Action history</Text>
        {children}
      </View>
    );
  }
  return <View />;
};

export const ActionHistoryItem = () => {
  const navigation = useNavigation();
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);
  const actionDetails = summary?.data?.action ?? null;
  const ticketId = useSelector(state => state.dashboard?.ticket?.id);
  if (isNull(actionDetails)) {
    return <NoActionView />;
  }
  const emailSubject = summary?.data?.action?.subject ?? 'Default subject';
  const senderName = summary?.data?.action?.emailSendBy ?? 'Default sender';
  const actionCount = (summary?.data?.totalAction ?? 0).toString();
  const timeStamp = convertDateTimeAgo(summary?.data?.action?.createdAt);

  const onItemPress = () => {
    navigation.navigate('actionEmailHistory', {
      ticketId: ticketId,
    });
  };

  return (
    <Pressable onPress={onItemPress} style={styles.actionHistoryItemContainer}>
      <Text style={styles.actionHistorySubjectText}>{emailSubject}</Text>
      <View style={styles.actionHistoryItemDetails}>
        <Text style={styles.actionHistoryDetailText}>by: </Text>
        <Text style={[styles.actionHistoryDetailText, styles.italic]}>
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

export const AttachmentView = () => {
  const {mediaFileList} = useSelector(state => state.dashboard);
  if (mediaFileList && mediaFileList.length && mediaFileList.length > 0) {
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
  }
  return <View />;
};

export const AttachmentItem = ({item, index}) => {
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

export const NoActionView = () => {
  return (
    <View>
      <Text style={[styles.actionHistoryDetailText, styles.italic]}>
        No action has taken yet
      </Text>
    </View>
  );
};

export const CustomKeyboardToolbar = ({
  toolbarRef,
  richTextfieldRef,
  keyboardHeight,
  handleCustomInsertLink,
}) => {
  // const [isInsertLinkModalVisible, setIsInsertLinkModalVisible] =
  //   useState(false);
  const BoldIcon = ({tintColor}) => (
    <MaterialIcons name="format-bold" size={20} color={tintColor} />
  );

  const ItalicIcon = ({tintColor}) => (
    <MaterialIcons name="format-italic" size={20} color={tintColor} />
  );

  const UnderlineIcon = ({tintColor}) => (
    <MaterialIcons name="format-underlined" size={20} color={tintColor} />
  );

  const SetInsertLinkIcon = ({tintColor}) => (
    <MaterialIcons name="insert-link" size={20} color={tintColor} />
  );

  // removed unused icons to satisfy linter

  const AlignLeftIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-left" size={20} color={tintColor} />
  );

  const AlignCenterIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-center" size={20} color={tintColor} />
  );

  const AlignRightIcon = ({tintColor}) => (
    <MaterialIcons name="format-align-right" size={20} color={tintColor} />
  );

  const AlignJustifyIcon = ({tintColor}) => (
    <MaterialCommunityIcons
      name="format-align-justify"
      size={20}
      color={tintColor}
    />
  );
  // const handleCustomInsertLink = () => {
  //   setIsInsertLinkModalVisible(state => !state);
  // };

  return (
    <View style={{...styles.toolbarContainer, bottom: keyboardHeight}}>
      <RichToolbar
        ref={toolbarRef}
        editor={richTextfieldRef}
        selectedIconTint={Colors.accentLight}
        iconTint={Colors.lightBlack}
        actions={[
          actions.setBold,
          actions.setItalic,
          actions.setUnderline,
          // actions.insertLink,
          actions.alignLeft,
          actions.alignCenter,
          actions.alignRight,
          actions.alignFull,
          INSERT_LINK,

          // actions.insertBulletsList,
          // actions.insertOrderedList,
          // actions.setStrikethrough,
        ]}
        iconMap={{
          [actions.setBold]: BoldIcon,
          [actions.setItalic]: ItalicIcon,
          [actions.setUnderline]: UnderlineIcon,
          [INSERT_LINK]: SetInsertLinkIcon,
          [actions.alignLeft]: AlignLeftIcon,
          [actions.alignCenter]: AlignCenterIcon,
          [actions.alignRight]: AlignRightIcon,
          [actions.alignFull]: AlignJustifyIcon,
          // [actions.insertBulletsList]: InsertBulletsListIcon,
          // [actions.insertOrderedList]: InsertOrderedListIcon,
          // [actions.setStrikethrough]: SetStrikethroughIcon,
        }}
        customInsertLink={handleCustomInsertLink}
        style={styles.richToolbar}
      />
    </View>
  );
};

export const SendEmail = props => {
  const defaultEmail = useSelector(
    state => state.dashboard.emailData.defaultTemplate,
  );
  const navigation = useNavigation();
  const {emailSentResponse} = useSelector(state => state.dashboard.emailData);
  console.log('props.route.params', props.route.params);
  const ticketId = JSON.stringify(props.route.params.ticketId);
  const toEmail = props.route.params.toEmail ?? '';
  const [isInsertLinkModalVisible, setIsInsertLinkModalVisible] =
    useState(false);
  const sampleEmailBody = React.useMemo(
    () => ({
      ticketId: ticketId,
      subject: '',
      toEmail: toEmail,
      emailBody: '',
      attachments: [],
    }),
    [ticketId, toEmail],
  );

  const [body, setBody] = useState(sampleEmailBody);
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const richText = React.useRef();
  const toolbarRef = React.useRef();
  const {emailTemplates} = useSelector(state => state.dashboard.emailData);

  const [isEmailDraftBottomSheetVisible, setEmailDraftBottomSheetVisible] =
    useState(false);
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  const openAiDraftBottomSheet = () => {
    setEmailDraftBottomSheetVisible(true);
  };

  const onCloseAiEmailDraftBottomSheet = () => {
    setEmailDraftBottomSheetVisible(false);
  };
  useEffect(() => {
    if (
      emailSentResponse &&
      emailSentResponse.status &&
      emailSentResponse.status === 'success'
    ) {
      setTimeout(() => {
        navigation.goBack();
      }, 1000);
      dispatch(resetSendEmailResponse());
    }
  }, [emailSentResponse, dispatch, navigation]);

  useEffect(() => {
    if (!isObjectEmpty(defaultEmail)) {
      setBody(state => ({
        ...state,
        emailBody: '',
      }));
      richText.current.setContentHTML('');
    }
  }, [defaultEmail]);

  const [isKeyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      'keyboardDidShow',
      e => {
        setKeyboardVisible(true);
        setKeyboardHeight(Platform.OS === 'ios' ? e.endCoordinates.height : 0);
        console.log('keyboardDidShowListener', JSON.stringify(e));
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

  useEffect(() => {
    dispatch(getActionHistorySummary(authToken, ticketId));
    dispatch(getActionHistoryDetails(authToken, ticketId));
    setBody(sampleEmailBody);
    richText.current.setContentHTML('');
  }, [dispatch, authToken, ticketId, sampleEmailBody]);

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
    closeTemplateBottomSheet();
  };

  const [isTemplateBottomSheetVisible, setIsTemplateBottomSheetVisible] =
    useState(false);

  const closeTemplateBottomSheet = () => {
    setIsTemplateBottomSheetVisible(false);
  };
  const onPressTemplate = () => {
    setIsTemplateBottomSheetVisible(true);
    richText.current.dismissKeyboard();
    console.log('onPressTemplate');
  };
  const onPressAiButton = () => {
    openAiDraftBottomSheet();
  };

  const setAIEmailDraft = emailBody => {
    console.log('setAIEmailDraft', JSON.stringify(emailBody));
    richText.current.setContentHTML(emailBody.body ?? '');
    onChangeEmailBody(emailBody.body ?? '');
    onChangeSubject(emailBody.subject ?? '');
  };

  const fontFamily = 'Fira Sans';
  const editorStyle = {
    initialCSSText: `${FontFamilyStylesheet}`,
    contentCSSText: `font-family: ${fontFamily}`,
    backgroundColor: Colors.white,
  };

  const insertLinkOnEditor = (title, url) => {
    console.log('insertLinkOnEditor called with:', {title, url});
    richText.current.insertLink(title, url);
  };
  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={40}>
        <VerticalSpaceBox />
        <GestureHandleBar />
        <VerticalSpaceBox />

        <RenderHeader />
        <VerticalSpaceBox />
        <EmailOptions
          onPressAiButton={onPressAiButton}
          body={body}
          onPressTemplate={onPressTemplate}
        />
        <SendEmailTo />
        <EmailSubject body={body} onChangeSubject={onChangeSubject} />
        <RichEditor
          ref={richText}
          useContainer
          disabled={false}
          initialFocus={false}
          onChange={onChangeEmailBody}
          placeholder={translate('action_email.email_body')}
          placeholderTextColor={Colors.borderColor}
          androidHardwareAccelerationDisabled={true}
          initialHeight={350}
          style={styles.textInput}
          editorStyle={editorStyle}
          setContentHTML={body.emailBody}
        />
        <AttachmentView />
        <ActionHistory>
          <ActionHistoryItem />
        </ActionHistory>
      </KeyboardAwareScrollView>

      <QPBottomSheet
        visible={isTemplateBottomSheetVisible}
        onClose={closeTemplateBottomSheet}
        bottomSheetHeight="40%"
        headerComponent={
          <QPBottomSheetHeader
            headerLabel="Select template"
            onClose={closeTemplateBottomSheet}
          />
        }>
        <SelectEmailTemplate
          data={emailTemplates}
          handleOnPress={item => {
            handleTemplateSelectAction(item);
          }}
        />
      </QPBottomSheet>

      <QPBottomSheet
        visible={isEmailDraftBottomSheetVisible}
        onClose={onCloseAiEmailDraftBottomSheet}
        bottomSheetHeight="90%"
        headerComponent={
          <QPBottomSheetHeader
            headerLabel="Draft with QuestionPro AI"
            onClose={onCloseAiEmailDraftBottomSheet}
          />
        }>
        <AIEmailDraftModal
          onClose={onCloseAiEmailDraftBottomSheet}
          setEmailBody={setAIEmailDraft}
        />
      </QPBottomSheet>
      {isKeyboardVisible && (
        <CustomKeyboardToolbar
          keyboardHeight={keyboardHeight}
          toolbarRef={toolbarRef}
          richTextfieldRef={richText}
          handleCustomInsertLink={() => {
            setIsInsertLinkModalVisible(true);
          }}
        />
      )}
      <InsertLinkModal
        setVisiblity={setIsInsertLinkModalVisible}
        isVisible={isInsertLinkModalVisible}
        insertLink={insertLinkOnEditor}
      />
    </SafeAreaView>
  );
};

export default SendEmail;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
    flexDirection: 'column',
    borderTopEndRadius: 5,
    borderTopStartRadius: 5,
    // marginTop: MarginConstants.tab2,
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
  generateUsingAIText: {
    justifyContent: 'center',
    alignSelf: 'center',
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.semiSecondary,
    padding: PaddingConstants.tab1,
    color: Colors.evenDarkerGrey,
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
    flex: 1,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  toolbarContainer: {
    position: 'absolute',

    // bottom: Platform.OS === 'ios' ? 300 : 0,
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

    height: MarginConstants.tab1_6x,
    backgroundColor: Colors.settingsBackground,
  },

  modalButton: {
    paddingVertical: PaddingConstants.halfTab,
    paddingHorizontal: PaddingConstants.tab1,
    backgroundColor: Colors.accentLight,
    borderRadius: 6,
  },
  modalButtonText: {
    fontFamily: FontFamily.medium,
    fontSize: TextSizes.secondary,
    color: Colors.accentLight,
  },
  renderOptionViewEnd: {
    flex: 2,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  renderOptionViewStart: {
    flex: 2,
    marginHorizontal: MarginConstants.tab1,
    flexDirection: 'row',
    justifyContent: 'flex-start',
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
    fontSize: TextSizes.secondary2,
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
  italic: {
    fontStyle: 'italic',
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

  contentContainer: {backgroundColor: Colors.red, height: '100%'},
  emailOptionContainer: {
    flexDirection: 'row',
    flex: 1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  instructionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: PaddingConstants.halfTab,
    marginHorizontal: MarginConstants.tab1,
    borderWidth: 1,
    borderColor: Colors.darkGrey,
    borderRadius: 5,
  },
  instructionInput: {
    flex: 1,
    paddingLeft: PaddingConstants.halfTab,
    paddingBottom: PaddingConstants.halfTab,
    color: Colors.filterIconColor,
    fontFamily: FontFamily.regular,
    fontSize: TextSizes.secondary,
  },
  generateButton: {
    padding: PaddingConstants.halfTab,
    borderRadius: 5,
  },
  closeButton: {
    borderRadius: 5,
    paddingEnd: PaddingConstants.halfTab,
  },
});
