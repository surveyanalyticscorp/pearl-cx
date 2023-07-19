import React, {useEffect, useCallback, useState} from 'react';
import {StyleSheet, Text, TextInput, View, Pressable} from 'react-native';
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
  getActionHistoryDetails,
  getActionHistorySummary,
  getDefaultEmailTemplate,
  getEmailTemplates,
  sendEmail,
} from '../../../redux/actions/closedloop.actions';
import StringUtils from '../../../Utils/StringUtils';
import {isObjectEmpty, showErrorFlashMessage} from '../../../Utils/Utility';
// import {useHeaderHeight} from '@react-navigation/elements';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import {convertDateTimeAgo} from '../../../Utils/TimeUtils';
import DocumentPicker, {types} from 'react-native-document-picker';

const RenderHeader = () => {
  return (
    <View style={styles.rowContainerHeader}>
      <Text style={styles.headerText}>Respond Via Email</Text>
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
      <AttachmentIcon onPressAttachment={onPressAttachment} />
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

const AttachmentIcon = ({onPressAttachment}) => {
  return (
    <Pressable onPress={onPressAttachment} style={styles.optionIcon}>
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

// const EmailBody = ({
//   refEditor,
//   refToolbar,
//   body,
//   onChangeEmailBody,
//   closeBottomSheet,
// }) => {
//   const scrollRef = React.useRef();

//   return (
//     <KeyboardAwareScrollView style={styles.textBox}>
//       {/* <KeyboardAvoidingView
//         style={{flex: 1}}
//         enabled
//         behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
//         keyboardVerticalOffset={12}> */}
//       {/* <TextInput
//     scrollEnabled={true}
//     multiline={true}
//     placeholder="Write email..."
//     style={styles.emailText}
//   /> */}
//       {/* <KeyboardAvoidingView
//   behavior={Platform.OS === 'ios' ? 'padding' : undefined}
//   keyboardVerticalOffset={Platform.OS === 'ios' ? 12 : 0}> */}

//       <RichEditor
//         ref={refEditor}
//         useContainer
//         disabled={false}
//         initialFocus={false}
//         onChange={onChangeEmailBody}
//         placeholder="Email body"
//         androidHardwareAccelerationDisabled={true}
//         initialHeight={300}
//         style={styles.textInput}
//         // initialContentHTML={body.emailBody}
//         setContentHTML={body.emailBody}
//         onFocus={closeBottomSheet}
//       />
//       <View style={[styles.rowContainer, {marginBottom: MarginConstants.tab2}]}>
//         <RichToolbar
//           ref={refToolbar}
//           editor={refEditor}
//           selectedIconTint={Colors.accentLight}
//           iconTint={Colors.lightBlack}
//           // editorInitializedCallback={() => updateRichText(emailBody)}
//           actions={[
//             actions.setBold,
//             actions.setItalic,
//             actions.setUnderline,
//             actions.insertBulletsList,
//             actions.insertOrderedList,
//             // actions.insertLink,
//             actions.setStrikethrough,
//             // actions.insertImage,
//             actions.keyboard,
//           ]}
//           style={{
//             justifyContent: 'flex-start',
//             alignItems: 'flex-start',
//             flex: 2,
//           }}
//         />
//       </View>
//       {/* </KeyboardAvoidingView> */}
//     </KeyboardAwareScrollView>
//   );
// };

const ActionHistory = ({onPressActionHistoryItem}) => {
  return (
    <View style={styles.actionHistoryContainer}>
      <Text style={styles.actionHistoryHeader}>Action History</Text>

      <ActionHistoryItem onItemPress={onPressActionHistoryItem} />
    </View>
  );
};

const ActionHistoryItem = ({onItemPress}) => {
  const {summary} = useSelector(state => state.dashboard.ticketActionHistory);

  if (isObjectEmpty(summary)) {
    return <View />;
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

export default function SendEmail(props) {
  // const height = useHeaderHeight();
  const defaultEmail = useSelector(
    state => state.dashboard.emailData.defaultTemplate,
  );
  const [body, setBody] = useState({
    subject: '',
    toEmail: props.route.params.toEmail ?? '',
    fromEmail: ACTION_EMAIL,
    emailBody: '',
  });
  const dispatch = useDispatch();
  const {authToken} = useSelector(state => state.global);
  const richText = React.useRef();
  const richTextToolBar = React.useRef();
  // const [userInfo, setUserInfo] = useState();
  const [userEmail, setUserEmail] = useState('');
  const templateList = useSelector(
    state => state.dashboard.emailData.emailTemplates,
  );

  const ticketId = JSON.stringify(props.route.params.ticketId);

  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['33%', '0%'];
  const [shadow, setShadow] = useState(false);
  const [fileResponse, setFileResponse] = useState([]);

  const closeBottomSheet = () => {
    bs.current.snapTo(bsSnapPoints.length - 1);
  };

  useEffect(() => {
    // AsyncStorage.getItem(ASYNC_USER_INFO).then((value) => {
    //   setUserInfo(JSON.parse(value));
    //   // console.log('USER_INFO__', value);
    // });
    AsyncStorage.getItem(ASYNC_USER_CREDENTIALS).then(value => {
      setUserEmail(JSON.parse(value)?.email);
    });
  }, [authToken]);

  useEffect(() => {
    if (!isObjectEmpty(defaultEmail)) {
      setBody(state => ({
        ...state,
        emailBody: defaultEmail?.templateText ?? '',
      }));

      richText.current.setContentHTML(
        defaultEmail?.templateText ?? '(empty body)',
      );
    }
  }, [defaultEmail]);

  useEffect(() => {
    console.log(`EMAIL_DATA: ${authToken} ${global.subscriberId}`);
    dispatch(
      getDefaultEmailTemplate(authToken, {subscriberId: global.subscriberId}),
    );
    dispatch(getEmailTemplates(authToken, {subscriberId: global.subscriberId}));
    dispatch(getActionHistorySummary(authToken, ticketId));
    dispatch(getActionHistoryDetails(authToken, ticketId));
  }, []);

  // useEffect(() => {
  //   setBody((state) => ({
  //     ...state,
  //     subject: defaultEmail.title ?? '',
  //     emailBody: defaultEmail.templateText,
  //   }));
  // }, [defaultEmail]);
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

  const onPressAttachment = useCallback(async () => {
    console.log('Attach items');

    try {
      const response = await DocumentPicker.pickMultiple({
        presentationStyle: 'fullScreen',
      });
      setFileResponse(response);
      console.log(fileResponse.length);
      console.log(
        fileResponse[0].name,
        fileResponse[0].mime,
        fileResponse[0].uri,
      );
    } catch (err) {
      console.warn(err);
    }
  }, []);

  const onPressSend = useCallback(() => {
    callSendEmailApi();
  }, []);

  const onChangeSubject = text => {
    setBody(state => ({...state, subject: text}));
  };

  const onChangeEmailBody = text => {
    setBody(state => ({...state, emailBody: text}));
  };
  const handleTemplateSelectAction = item => {
    // setDefaultEmail(item);
    setBody(state => ({
      ...state,
      // subject: item.title ?? '',
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

  const callSendEmailApi = () => {
    const queryParam = {
      subscriberId: global.subscriberId,
      emailAddress: userEmail,
    };

    if (StringUtils.isEmpty(body.subject)) {
      showErrorFlashMessage('Empty email subject');
      return;
    }
    if (StringUtils.isEmpty(body.emailBody)) {
      showErrorFlashMessage('Empty email body');
      return;
    } else {
      dispatch(sendEmail(authToken, ticketId, body, queryParam));
      // props.navigation.goBack();
    }
  };

  return (
    <View style={styles.container}>
      <KeyboardAwareScrollView>
        {/* <Animated.ScrollView
        style={[
          styles.innerContainer,
          {
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            color: shadow ? Colors.accent : Colors.borderColor,
          },
        ]}> */}
        {/* <KeyboardAvoidingView
          style={{flex: 1}}
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={-900}> */}
        {/* <KeyboardAvoidingView
          enabled
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 60 : 16}> */}
        <RenderHeader />
        <RenderTicketId ticketId={ticketId} />
        <RenderOptionsView
          onPressTemplate={onPressTemplate}
          onPressAttachment={onPressAttachment}
          onPressSend={onPressSend}
        />
        {/* <RenderToTextInput />
        <RenderFromTextInput /> */}
        <EmailToFrom title={'To:'} value={body.toEmail} />
        <EmailToFrom title={'From:'} value={body.fromEmail} />

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
          placeholder="Email body"
          androidHardwareAccelerationDisabled={true}
          initialHeight={300}
          style={styles.textInput}
          // initialContentHTML={body.emailBody}
          setContentHTML={body.emailBody}
          onFocus={closeBottomSheet}
        />
        <RichToolbar
          ref={richTextToolBar}
          editor={richText}
          selectedIconTint={Colors.accentLight}
          iconTint={Colors.lightBlack}
          // editorInitializedCallback={() => updateRichText(emailBody)}
          actions={[
            actions.setBold,
            actions.setItalic,
            actions.setUnderline,
            actions.insertBulletsList,
            actions.insertOrderedList,

            // actions.insertLink,
            actions.setStrikethrough,
            // actions.insertImage,
            actions.keyboard,
          ]}
          style={{
            justifyContent: 'flex-start',
            alignItems: 'flex-start',
            flex: 2,
          }}
        />
        <ActionHistory onPressActionHistoryItem={onPressActionHistoryItem} />
        {/* <EmailBody
          refEditor={richText}
          refToolbar={richTextToolBar}
          body={body}
          onChangeEmailBody={onChangeEmailBody}
          closeBottomSheet={closeBottomSheet}
        /> */}
        {/* </KeyboardAvoidingView> */}
        {/* </Animated.ScrollView> */}
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

  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
