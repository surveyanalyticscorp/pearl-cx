import React, {useEffect, useCallback, useState, useRef} from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Pressable,
  FlatList,
  SafeAreaView,
  Modal,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
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
  resetSendEmailResponse,
} from '../../../redux/actions/closedloop.actions';
import StringUtils from '../../../Utils/StringUtils';
import {isObjectEmpty, showErrorFlashMessage} from '../../../Utils/Utility';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import {isNull} from 'lodash';
import {AttachmentIcon, IonIcon, MaterialIcons} from '../../../Utils/IconUtils';
import {translate} from '../../../Utils/MultilinguaUtils';
import {useNavigation} from '@react-navigation/native';
import SendEmailTo from './sendEmail/SendEmailTo';
import EmailOptions from './sendEmail/EmailOptions';
import {apiHandler} from '../../../api/ApiHandler';
import {AI_ROUTER_API_KEY, AI_ROUTER_API_URL} from '../../../api/Constant';
import QPSpinner from '../../../widgets/QPSpinner';
import ActionButton from 'react-native-action-button';
import AiDraftButton from './sendEmail/AiDraftButton';
import AIEmailDraftModal from './AIEmailDraftModal';

export const RenderHeader = () => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>Respond via email</Text>
      <CloseButton color={Colors.filterIconColor} />
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
      <Pressable style={{alignSelf: 'flex-end'}} onPress={() => {}}>
        <IonIcon name="close" size={20} color={Colors.filterIconColor} />
      </Pressable>
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
  const navigation = useNavigation();
  const {emailSentResponse} = useSelector(state => state.dashboard.emailData);
  console.log('props.route.params', props.route.params);
  const ticketId = JSON.stringify(props.route.params.ticketId);
  const sampleEmailBody = {
    ticketId: JSON.stringify(props.route.params.ticketId),
    subject: '',
    toEmail: props.route.params.toEmail ?? '',
    emailBody: '',
    attachments: [],
  };
  const [body, setBody] = useState(sampleEmailBody);
  const [isPromptVisible, setPromptVisibility] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const richText = React.useRef();
  const {emailTemplates} = useSelector(state => state.dashboard.emailData);

  const [emailDraftModalVisible, setEmailDraftModalVisible] = useState(false);

  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['33%', '50%'];

  const closeBottomSheet = () => {
    if (bs.current) {
      setIsBottomSheetVisible(false);
      bs.current.snapTo(bsSnapPoints.length - 1);
    }
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
  }, [emailSentResponse]);

  useEffect(() => {
    if (!isObjectEmpty(defaultEmail)) {
      setBody(state => ({
        ...state,
        emailBody: '',
      }));
      richText.current.setContentHTML('');
    }
  }, [defaultEmail]);

  useEffect(() => {
    dispatch(getActionHistorySummary(authToken, ticketId));
    dispatch(getActionHistoryDetails(authToken, ticketId));
    setBody(sampleEmailBody);
    richText.current.setContentHTML('');
  }, []);

  const onPressTemplate = useCallback(() => {
    richText.current.dismissKeyboard();
    setIsBottomSheetVisible(true);
    if (bs.current) {
      bs.current.snapTo(0);
    }
  }, []);

  const onChangeSubject = text => {
    setBody(state => ({...state, subject: text}));
  };

  const onChangeEmailBody = text => {
    setBody(state => ({...state, emailBody: text}));
  };
  const handleTemplateSelectAction = item => {
    setPromptVisibility(false);
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
          data={emailTemplates}
          handleOnPress={item => {
            handleTemplateSelectAction(item);
          }}
          handleOnPressGenarateWithAI={() => {
            setBody(state => ({
              ...state,
              emailBody: '',
            }));
            richText.current.setContentHTML('');
            closeBottomSheet();
          }}
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

  const onPressAiButton = () => {
    setEmailDraftModalVisible(state => !state);
  };

  const [isBottomSheetVisible, setIsBottomSheetVisible] = useState(false);

  const setAIEmailDraft = emailBody => {
    console.log('setAIEmailDraft', JSON.stringify(emailBody));
    richText.current.setContentHTML(emailBody.body ?? '');
    onChangeEmailBody(emailBody.body ?? '');
    onChangeSubject(emailBody.subject ?? '');
  };

  const renderEmailDraftModal = () => {
    return (
      <AIEmailDraftModal
        emailDraftModalVisible={emailDraftModalVisible}
        setEmailDraftModalVisible={setEmailDraftModalVisible}
        setEmailBody={setAIEmailDraft}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAwareScrollView enableOnAndroid={true} extraScrollHeight={40}>
        <RenderHeader />

        <EmailOptions
          onPressAiButton={onPressAiButton}
          body={body}
          onPressTemplate={onPressTemplate}
        />
        <SendEmailTo />
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
          initialHeight={350}
          style={styles.textInput}
          editorStyle={{
            backgroundColor: isBottomSheetVisible
              ? Colors.transparentBackground
              : Colors.white,
          }}
          setContentHTML={body.emailBody}
          onFocus={closeBottomSheet}
        />
        {!isLoading && <AttachmentView />}
      </KeyboardAwareScrollView>
      {isBottomSheetVisible && (
        <BottomSheet
          ref={bs}
          enabledContentGestureInteraction={false}
          snapPoints={bsSnapPoints}
          initialSnap={0}
          renderContent={renderSelectTemplate}
          renderHeader={renderHeader}
          onCloseEnd={() => {
            setIsBottomSheetVisible(false);
          }}
          callbackNode={fall}
        />
      )}
      {/* {isActionButtonVisible && renderAIActionButton()} */}
      {emailDraftModalVisible && renderEmailDraftModal()}
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
