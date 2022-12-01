import React, {useEffect, useState} from 'react';
import {
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import IonIcons from 'react-native-vector-icons/Ionicons';
import {BottomSheetHeader, CloseButton} from '../../../routes/CommonScreen';
import Animated from 'react-native-reanimated';
import AsyncStorage from '@react-native-community/async-storage';
import {ASYNC_USER_INFO, ASYNC_USER_CREDENTIALS} from '../../../api/Constant';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {TouchableOpacity} from 'react-native-gesture-handler';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectEmailTemplate from './SelectEmailTemplate';
import {useDispatch, useSelector} from 'react-redux';
import {sendEmail} from '../../../redux/actions/closedloop.actions';
export default function SendEmail(props) {
  const [body, setBody] = useState({
    subject: '',
    toEmail: props.route.params.toEmail ?? '',
    fromEmail: 'noreply@questionpro.com',
    emailBody: '',
  });
  const dispatch = useDispatch();
  const {authToken} = useSelector((state) => state.global);
  const richText = React.useRef();
  const richTextToolBar = React.useRef();
  const [userInfo, setUserInfo] = useState();
  const [userEmail, setUserEmail] = useState('');
  const [templateList, setTemplateList] = useState(
    useSelector((state) => state.dashboard.emailData.emailTemplates),
  );
  const [defaultEmail, setDefaultEmail] = useState(
    useSelector((state) => state.dashboard.emailData.defaultTemplate),
  );

  const ticketId = JSON.stringify(props.route.params.ticketId);
  useEffect(() => {
    AsyncStorage.getItem(ASYNC_USER_INFO).then((value) => {
      setUserInfo(JSON.parse(value));
      // console.log('USER_INFO__', value);
    });
    AsyncStorage.getItem(ASYNC_USER_CREDENTIALS).then((value) => {
      setUserEmail(JSON.parse(value)?.email);
    });
  }, [authToken]);

  useEffect(() => {
    setBody((state) => ({
      ...state,
      subject: defaultEmail.title ?? '',
      emailBody: defaultEmail.templateText,
    }));
  }, [defaultEmail]);

  const RenderHeader = () => {
    return (
      <View style={styles.rowContainerHeader}>
        <Text style={styles.headerText}>Respond Via Email</Text>
        <CloseButton color={Colors.filterIconColor} />
      </View>
    );
  };

  const RenderIonIcon = (props) => {
    const color = Colors.filterIconColor;

    return (
      <IonIcons
        name={props.name}
        size={props.size ?? 24}
        color={props.color ?? color}
        style={props.style}
      />
    );
  };
  const getSendIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => callSendEmailApi()}
        style={styles.optionIcon}>
        <RenderIonIcon
          name={'send'}
          color={Colors.accentLight}
          style={{transform: [{rotateZ: '-45deg'}]}}
        />
      </TouchableOpacity>
    );
  };

  const getAttachmentIcon = () => {
    return (
      <TouchableOpacity style={styles.optionIcon}>
        <RenderIonIcon name={'attach'} />
      </TouchableOpacity>
    );
  };

  const getTemplateIcon = () => {
    return (
      <TouchableOpacity
        onPress={() => {
          bs.current.snapTo(0);
        }}
        style={styles.optionIcon}>
        <RenderIonIcon name={'ios-reader'} />
      </TouchableOpacity>
    );
  };

  const RenderOptionsView = () => {
    return (
      <View style={styles.renderOptionView}>
        {getTemplateIcon()}
        {getAttachmentIcon()}
        {getSendIcon()}
      </View>
    );
  };

  const handleTemplateSelectAction = (item) => {
    setDefaultEmail(item);
    richText.current.setContentHTML(item.templateText);
    bs.current.snapTo(bsSnapPoints.length - 1);
  };

  const renderSelectTemplate = () => {
    return (
      <View style={styles.contentContainer}>
        <SelectEmailTemplate
          data={templateList}
          handleOnPress={(item) => handleTemplateSelectAction(item)}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={'Select Template'}
        onPressClose={() => bs.current.snapTo(bsSnapPoints.length - 1)}
      />
    );
  };

  const callSendEmailApi = () => {
    const queryParam = {
      subscriberId: global.subscriberId,
      emailAddress: userEmail,
    };

    dispatch(sendEmail(authToken, ticketId, body, queryParam));
    // console.log('EMAIL_PAYLOAD', JSON.stringify(body));
    // console.log('EMAIL_PAYLOAD', JSON.stringify(ticketId));
    // console.log('EMAIL_PAYLOAD', JSON.stringify(queryParam));
    props.navigation.goBack();
  };

  const bs = React.useRef(null);
  const fall = new Animated.Value(1);
  const bsSnapPoints = ['33%', '0%'];
  const [shadow, setShadow] = useState(false);

  return (
    <View style={styles.container}>
      <Animated.ScrollView
        style={[
          styles.innerContainer,
          {
            opacity: Animated.add(0.3, Animated.multiply(fall, 1.0)),
            color: shadow ? Colors.accent : Colors.borderColor,
          },
        ]}
        keyboardDismissMode="none">
        <RenderHeader />
        <RenderOptionsView />
        {/* <RenderToTextInput />
        <RenderFromTextInput /> */}
        <View>
          <View style={styles.rowContainerCenterAlign}>
            <Text style={styles.titleText}>{'To:'}</Text>

            <TextInput
              placeholder="Send to email"
              style={styles.textInputEmail}
              defaultValue={body.toEmail}
              onChangeText={(text) => {
                setBody((state) => ({...state, toEmail: text}));
              }}
            />
          </View>
          <View style={styles.devider} />
        </View>

        <View>
          <View style={styles.rowContainerCenterAlign}>
            <Text style={styles.titleText}>{'From:'}</Text>

            <TextInput
              defaultValue={body.fromEmail ?? ''}
              onChangeText={(text) => {
                setBody((state) => ({...state, fromEmail: text}));
              }}
              placeholder="Send from email"
              style={styles.textInputEmail}
            />
          </View>
          <View style={styles.devider} />
        </View>
        {/* <RenderSubjectTextInput /> */}
        <View>
          <View style={styles.rowContainerCenterAlign}>
            <Text style={styles.titleText}>{'Subject:'}</Text>
            <TextInput
              placeholder="Email subject"
              defaultValue={body.subject ?? ''}
              style={styles.textInput}
              onChangeText={(text) => {
                setBody((state) => ({...state, subject: text}));
              }}
            />
          </View>
          <View style={styles.devider} />
        </View>
        <View style={styles.textBox}>
          <KeyboardAvoidingView>
            {/* <TextInput
              scrollEnabled={true}
              multiline={true}
              placeholder="Write email..."
              style={styles.emailText}
            /> */}

            <RichEditor
              ref={richText}
              onChange={(text) => {
                setBody((state) => ({...state, emailBody: text}));
              }}
              placeholder="Email body"
              androidHardwareAccelerationDisabled={true}
              initialHeight={300}
              style={styles.textInput}
              initialContentHTML={defaultEmail?.templateText}
            />
            <View style={styles.rowContainer}>
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
                  actions.insertLink,
                  actions.setStrikethrough,
                  // actions.insertImage,
                  // actions.keyboard,
                ]}
                style={{
                  justifyContent: 'flex-start',
                  alignItems: 'flex-start',
                  flex: 2,
                }}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </Animated.ScrollView>

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
    marginTop: MarginConstants.halfTab,
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
    flex: 1,
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
  devider: {
    height: 1,
    flex: 1,
    backgroundColor: Colors.darkGrey,
  },
  contentContainer: {backgroundColor: Colors.white, height: '100%'},
});
