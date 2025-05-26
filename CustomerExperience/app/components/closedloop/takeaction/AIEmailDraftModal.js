import React, {useEffect, useState, useCallback, useRef} from 'react';
import {Modal, Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {IonIcon} from '../../../Utils/IconUtils';
import {useSelector} from 'react-redux';
import {AI_ROUTER_API_KEY, AI_ROUTER_API_URL} from '../../../api/Constant';
import {apiHandler} from '../../../api/ApiHandler';
import QPSpinner from '../../../widgets/QPSpinner';
import {showErrorFlashMessage} from '../../../Utils/Utility';
import {MarginConstants} from '../../../styles/margin.constants';
import StringUtils from '../../../Utils/StringUtils';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {EmailBodyTextView} from './sendEmail/AiEmailBodyTextView';
import QPBottomSheet from './QPBottomSheet';
import QPBottomSheetHeader from './QPBottomSheetHeader';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import EndAlignedView from '../../../routes/commonUI/EndAlignedView';
import StartAlignedView from '../../../routes/commonUI/StartAlignedView';
import QPDropDownMenu from './QPDropDownMenu';

const RenderLoadingSpinner = ({isLoading}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.loading}>
      <QPSpinner spinnerText={'Crafting your email with AI...'} />
    </View>
  );
};

function DropDownButton({label, onPress, isOpen, onLayout}) {
  return (
    <Pressable
      onPress={onPress}
      onLayout={onLayout}
      style={styles.dropDownButton}>
      <Text style={{...styles.chipButtonText, color: Colors.filterIconColor}}>
        {label}
      </Text>
      <IonIcon
        name={isOpen ? 'chevron-down' : 'chevron-up'}
        size={20}
        color={Colors.filterIconColor}
      />
    </Pressable>
  );
}

function RegenerateButton({onPress}) {
  return (
    <Pressable onPress={onPress}>
      <IonIcon name="refresh" size={28} color={Colors.accentLight} />
    </Pressable>
  );
}

function InsertButton({onPress}) {
  return (
    <QPButton
      buttonText={'Insert'}
      buttonColor={Colors.accentLight}
      onPress={onPress}
      textStyle={buttonStyles.primaryButtonText}
      style={{
        flexDirection: 'row-reverse',
        ...buttonStyles.primaryButton,
        borderRadius: 2,
      }}
    />
  );
}
function EmailGenarationActionContainer({children}) {
  return (
    <View
      style={{
        marginVertical: MarginConstants.tab1_2x,
        paddingVertical: PaddingConstants.tab1_2x,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      {children}
    </View>
  );
}

const ChipButton = ({label, onPress, currentDraftType}) => {
  const isActive = currentDraftType === label;
  const borderColor = isActive ? Colors.accentLight : Colors.filterIconColor;
  const backgroundColor = isActive ? Colors.accentLight : Colors.white;
  const fontColor = isActive ? Colors.white : Colors.filterIconColor;
  const onPressChip = () => {
    onPress(isActive ? 'default' : label);
  };
  return (
    <Pressable
      style={{
        ...styles.chipButton,
        borderColor: borderColor,
        backgroundColor: backgroundColor,
      }}
      onPress={onPressChip}>
      <Text style={{...styles.chipButtonText, color: fontColor}}>
        {StringUtils.uppercaseFirstChar(label)}
      </Text>
    </Pressable>
  );
};

const AIEmailDraftModal = ({
  emailDraftModalVisible,
  setEmailDraftModalVisible,
  setEmailBody,
}) => {
  const [isLoading, setIsLoading] = useState(true);
  const [drafts, setDrafts] = useState([]);
  const [draftType, setDraftType] = useState('Refine');
  const customerName = useSelector(
    state => state.dashboard?.ticket?.panelMember?.name,
  );
  const [currentDraftBody, setCurrentDraftBody] = useState('');
  const {userInfo} = useSelector(state => state.global);
  const {comment} = useSelector(state => state.dashboard.ticket);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownPosition, setDropDownPosition] = useState({x: 0, y: 0});
  const dropDownButtonRef = useRef(null);

  const dropDownItems = ['shorten', 'formalize', 'elaborate'];

  const onChangeEmailBody = text => {
    console.log('onChangeEmailBody', text);
    setCurrentDraftBody(text);
  };

  const mockApiData = {
    result: {
      documents: [
        {
          uuid: 45189,
          prompt_id: 129,
          use_case_name: 'generate-email-draft-clf',
          prompt_version: 2,
          meta: {id: 1},
          output: [
            {
              key: 'content',
              value_type: 'json_object',
              value: {
                statusCode: 200,
                emailDrafts: [
                  {
                    type: 'default',
                    subject: 'We Apologize for the Issue with Your Package',
                    body: '<p>Dear Sean Evans,</p><p>Thank you for reaching out. We sincerely apologize for the inconvenience regarding your package being unsealed upon delivery. <br> It should have been properly sealed to ensure its integrity. We take such matters seriously and will investigate this further.</p><p>Thank you for your understanding.</p><p>Best regards,<br>Mehedi Hasan</p>',
                  },
                  {
                    type: 'formalize',
                    subject: 'Apology Regarding Your Package Delivery',
                    body: '<p>Dear Sean Evans,</p><p>I am writing to express my sincere apologies for the condition of your package upon delivery. It is our standard to ensure packages are sealed correctly to maintain their integrity. We will address this issue promptly.</p><p>Thank you for your understanding.</p><p>Sincerely,<br>Mehedi Hasan</p>',
                  },
                  {
                    type: 'elaborate',
                    subject: 'Our Apologies for the Unsealed Package',
                    body: '<p>Dear Sean Evans,</p><p>Thank you for bringing this matter to our attention. We truly regret that your package was unsealed during delivery. <br> This does not reflect our standards, and we will take necessary steps to ensure that all packages are properly sealed in the future. <br> Your feedback is invaluable in helping us improve our services.</p><p>Thank you for your understanding, and please feel free to reach out if you have any further concerns.</p><p>Warm regards,<br>Mehedi Hasan</p>',
                  },
                  {
                    type: 'shorten',
                    subject: 'Regarding Your Package Issue',
                    body: "<p>Dear Sean Evans,</p><p>I'm sorry to hear about your unsealed package. It should have been properly sealed. We will look into this issue immediately.</p><p>Thank you for your understanding.</p><p>Best,<br>Mehedi Hasan</p>",
                  },
                ],
              },
            },
          ],
          usage: {
            prompt_tokens: 555,
            completion_tokens: 472,
            total_tokens: 1027,
            prompt_tokens_details: {cached_tokens: 0, audio_tokens: 0},
            completion_tokens_details: {
              reasoning_tokens: 0,
              audio_tokens: 0,
              accepted_prediction_tokens: 0,
              rejected_prediction_tokens: 0,
            },
          },
        },
      ],
    },
    error: null,
  };

  const mockAIRouterAPICall = useCallback(userPrompt => {
    setIsLoading(true);

    setTimeout(() => {
      setDrafts(mockApiData.result.documents[0].output[0].value.emailDrafts);
      setIsLoading(false);
    }, 2000);
  }, []);

  const aiRouterAPICall = useCallback(
    userPrompt => {
      setIsLoading(true);

      apiHandler.generateEmailWithAI(
        AI_ROUTER_API_URL,
        AI_ROUTER_API_KEY,
        {
          user_id: 4894850,
          use_case_name: 'generate-email-draft-clf',
          prompt_version: 2,
          organization_id: 4787064,
          data_center: 'US',
          meta: {
            id: 1,
          },
          input_data: {
            messages: [
              {
                key: 'content',
                value: 'JSON Draft email for customer',
              },
              {
                key: 'customerName',
                value: customerName,
              },
              {
                key: 'senderName',
                value: userInfo.firstName + '\t' + userInfo.lastName,
              },
              {
                key: 'ticketDetails',
                value: comment,
              },
              {
                key: 'serveyDetails',
                value: null,
              },
              {
                key: 'comments',
                value: userPrompt ?? 'Keep it short and to the point',
              },
            ],
          },
        },
        response => {
          setIsLoading(false);

          console.log('response', response);
          if (
            response?.error === null &&
            response.result.documents[0].output[0].value.statusCode === 200
          ) {
            setDrafts(response.result.documents[0].output[0].value.emailDrafts);
          } else {
            showErrorFlashMessage(
              response?.error?.message ?? "Couldn't generate email",
            );
          }
        },
        error => {
          setIsLoading(false);
          console.log('error', error);
          showErrorFlashMessage(error?.message ?? "Couldn't generate email");
        },
      );
    },
    [customerName, userInfo, comment],
  );

  const setTextToEditor = useCallback(() => {
    console.log('setTextToEditor', draftType);

    const selectedDraft =
      drafts.find(draft => draft.type === draftType) ?? drafts[0];
    setCurrentDraftBody(selectedDraft.body);
    console.log('setTextToEditor', selectedDraft.type);
  }, [drafts, draftType]);

  useEffect(() => {
    // aiRouterAPICall();
    mockAIRouterAPICall();
  }, [mockAIRouterAPICall]);

  useEffect(() => {
    if (drafts.length > 0) {
      setTextToEditor();
    }
  }, [drafts, draftType, setTextToEditor]);

  const onPressChip = selected => {
    console.log('onPressChip', selected);
    setDraftType(selected);
  };

  const onPressInsert = () => {
    console.log('onPressInsert', draftType, JSON.stringify(currentDraftBody));
    const selectedDraft =
      drafts.find(draft => draft.type === draftType) ?? drafts[0];
    setEmailBody({
      ...selectedDraft,
      body: currentDraftBody ?? selectedDraft.body,
    });
    setEmailDraftModalVisible(false);
  };
  const onPressRegenerate = () => {
    console.log('onPressRegenerate');

    // aiRouterAPICall();
    mockAIRouterAPICall();
  };

  const onPressDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const onDropDownButtonLayout = event => {
    const {x, y} = event.nativeEvent.layout;
    // console.log('onDropDownButtonLayout', x - 40, y);
    setDropDownPosition({x, y});
  };

  const onSelectDropDownItem = item => {
    setDraftType(item);
  };
  const onPressClose = () => {
    setEmailDraftModalVisible(false);
  };
  return (
    <QPBottomSheet
      visible={emailDraftModalVisible}
      onClose={onPressClose}
      headerComponent={
        <QPBottomSheetHeader
          headerLabel="Email Drafting with AI"
          onClose={onPressClose}
        />
      }>
      <View style={styles.modalBody}>
        {/* {isLoading && renderLoadingSpinner()} */}

        <EmailBodyTextView text={currentDraftBody} />
        <RenderLoadingSpinner isLoading={isLoading} />
        <EmailGenarationActionContainer>
          <StartAlignedView>
            <RegenerateButton onPress={onPressRegenerate} />
            <HorizontalSpaceBox multiplyBy={2} />
            <DropDownButton
              label={draftType}
              onPress={onPressDropDown}
              isOpen={isDropDownOpen}
              onLayout={onDropDownButtonLayout}
            />
          </StartAlignedView>

          <EndAlignedView>
            <InsertButton onPress={onPressInsert} />
          </EndAlignedView>
        </EmailGenarationActionContainer>
        <QPDropDownMenu
          visible={isDropDownOpen}
          onClose={() => setIsDropDownOpen(false)}
          anchorPosition={dropDownPosition}
          items={dropDownItems}
          onSelectItem={onSelectDropDownItem}
          selectedItem={draftType}
        />
      </View>
    </QPBottomSheet>
  );
};

export default AIEmailDraftModal;

const styles = StyleSheet.create({
  modalBody: {
    padding: PaddingConstants.tab2,
  },
  loading: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    flexDirection: 'column',
  },
  chipButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: MarginConstants.tab1_2x,
    padding: PaddingConstants.tab1_2x,
  },
  dropDownButton: {
    flexDirection: 'row',
    marginEnd: MarginConstants.tab1_4x,
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
    borderRadius: 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderColor,
  },
  chipButton: {
    borderRadius: 5,
    padding: PaddingConstants.halfTab,
    marginStart: MarginConstants.tab1,
    marginEnd: MarginConstants.tab1_2x,
    borderWidth: 2,
  },
  chipButtonText: {
    fontSize: TextSizes.secondary2,
    fontFamily: FontFamily.regular,
    marginEnd: MarginConstants.tab1_2x,
  },
});
