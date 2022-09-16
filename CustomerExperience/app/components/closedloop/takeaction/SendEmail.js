import React, {useEffect, useState} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  KeyboardAvoidingView,
  // Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  // TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
// import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
// import {connect} from 'react-redux';
// import {
//   clearDetractorTicketDetails,
//   getClosedLoopOwnerDetails,
//   getClosedLoopSegmentDetails,
//   updateTicket,
// } from '../../../redux/actions/dashboard.actions';
// import ArrayUtils from '../../../Utils/ArrayUtils';
// import StringUtils from '../../../Utils/StringUtils';
// import {updateClosedLoopTicket} from '../../../redux/sagas/ClosedLoopSaga';
// import QPSpinner from '../../../widgets/QPSpinner';
// import {showErrorFlashMessage} from '../../../Utils/Utility';
// import {wantToReloadDashboard} from '../../../redux/actions';
// import {translate} from '../../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
// import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
// import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {BottomSheetHeader, CloseButton} from '../../../routes/CommonScreen';
import Animated from 'react-native-reanimated';

// import QPButton from '../../../widgets/Button';
// import style from '../../../widgets/qp-calendar/calendar/header/style';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';
import {TouchableOpacity} from 'react-native-gesture-handler';
// import QPTextField from '../../../widgets/TextField';
import BottomSheet from 'reanimated-bottom-sheet';
import SelectEmailTemplate from './SelectEmailTemplate';
export default function SendEmail(props) {
  const richText = React.useRef();

  const richTextHandle = (text) => {
    console.log(`Text: ${text}`);
  };

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
      <TouchableOpacity style={styles.optionIcon}>
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

  const RenderToTextInput = () => {
    return (
      <View>
        <View style={styles.rowContainerCenterAlign}>
          <Text style={styles.titleText}>{'To:'}</Text>

          <TextInput
            placeholder="Send to email"
            style={styles.textInputEmail}
          />
        </View>
        <View style={styles.devider} />
      </View>
    );
  };
  const RenderFromTextInput = () => {
    return (
      <View>
        <View style={styles.rowContainerCenterAlign}>
          <Text style={styles.titleText}>{'From:'}</Text>

          <TextInput
            placeholder="Send from email"
            style={styles.textInputEmail}
          />
        </View>
        <View style={styles.devider} />
      </View>
    );
  };

  const handleTemplateSelectAction = (item) => {
    console.log(item);
    bs.current.snapTo(bsSnapPoints.length - 1);
  };

  const renderSelectTemplate = () => {
    const data = [
      'Template 01',
      'Template 02',
      'Template 03',
      'Template 04',
      'Template 05',
    ];

    return (
      <View style={styles.contentContainer}>
        <SelectEmailTemplate
          data={data}
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

  const RenderSubjectTextInput = () => {
    return (
      <View>
        <View style={styles.rowContainerCenterAlign}>
          <Text style={styles.titleText}>{'Subject:'}</Text>
          <TextInput placeholder="Email subject" style={styles.textInput} />
        </View>
        <View style={styles.devider} />
      </View>
    );
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
        ]}>
        <RenderHeader />
        <RenderOptionsView />
        <RenderToTextInput />
        <RenderFromTextInput />
        <RenderSubjectTextInput />
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
              onChange={richTextHandle}
              placeholder="Email body"
              androidHardwareAccelerationDisabled={true}
              initialHeight={300}
              style={styles.textInput}
            />
            <View style={styles.rowContainer}>
              <RichToolbar
                editor={richText}
                selectedIconTint={Colors.accentLight}
                iconTint={Colors.lightBlack}
                actions={[
                  actions.setBold,
                  actions.setItalic,
                  actions.setUnderline,
                  // actions.insertBulletsList,
                  // actions.insertOrderedList,
                  actions.insertLink,
                  // actions.setStrikethrough,
                  actions.insertImage,
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
        onCloseEnd={() => setShadow(false)}
        onOpenStart={() => setShadow(true)}
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
