import React, {useEffect, useState} from 'react';
import SafeAreaView from 'react-native-safe-area-view';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {FontFamily} from '../../../styles/font.constants';
import {MarginConstants} from '../../../styles/margin.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import ModalDropdown from '../../../widgets/drop-down/ModalDropdown';
import {connect} from 'react-redux';
import {
  clearDetractorTicketDetails,
  getClosedLoopOwnerDetails,
  getClosedLoopSegmentDetails,
  updateTicket,
} from '../../../redux/actions/dashboard.actions';
import ArrayUtils from '../../../Utils/ArrayUtils';
import StringUtils from '../../../Utils/StringUtils';
import {updateClosedLoopTicket} from '../../../redux/sagas/ClosedLoopSaga';
import QPSpinner from '../../../widgets/QPSpinner';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {wantToReloadDashboard} from '../../../redux/actions';
import {translate} from '../../../Utils/MultilinguaUtils';
import IonIcons from 'react-native-vector-icons/Ionicons';
import MaterialIcon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcon from 'react-native-vector-icons/MaterialCommunityIcons';
import {CloseButton} from '../../../routes/CommonScreen';

import QPButton from '../../../widgets/Button';
import style from '../../../widgets/qp-calendar/calendar/header/style';
import {RichEditor, RichToolbar, actions} from 'react-native-pell-rich-editor';

export default function SendEmail(props) {
  const richText = React.useRef();

  const richTextHandle = (text) => {
    console.log(`Text: ${text}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.container}>
        <View style={[styles.rowContainer, {justifyContent: 'space-between'}]}>
          <Text style={styles.headerText}>Email</Text>
          <CloseButton color={Colors.filterIconColor} />
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
              onChange={richTextHandle}
              placeholder="Write your cool content here :)"
              androidHardwareAccelerationDisabled={true}
              style={styles.richTextEditorStyle}
              initialHeight={250}
            />
            <View style={styles.rowContainer}>
              <RichToolbar
                editor={richText}
                selectedIconTint="#873c1e"
                iconTint="#312921"
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
              <QPButton
                buttonText={'Send'}
                style={styles.buttonStyle}
                textStyle={styles.buttonTextStyle}
              />
            </View>
          </KeyboardAvoidingView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    flex: 1,
  },
  rowContainer: {
    flex: 1,
    flexDirection: 'row',
    // backgroundColor: Colors.accentLight,
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
    padding: PaddingConstants.tab1,
    color: Colors.filterIconColor,
  },

  textBox: {
    marginVertical: MarginConstants.tab2,
    marginHorizontal: MarginConstants.tab1,
    padding: PaddingConstants.halfTab,
    borderWidth: 1,
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
});
