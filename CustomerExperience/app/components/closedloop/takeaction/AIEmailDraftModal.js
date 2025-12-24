import React, {useEffect, useState} from 'react';
import {Pressable, StyleSheet, Text, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {REFINE_DEFAULT} from '../../../api/Constant';
import {MarginConstants} from '../../../styles/margin.constants';
import QPButton from '../../../widgets/Button';
import {buttonStyles} from '../../../styles/button.styles';
import {EmailBodyTextView} from './sendEmail/AiEmailBodyTextView';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import EndAlignedView from '../../../routes/commonUI/EndAlignedView';
import StartAlignedView from '../../../routes/commonUI/StartAlignedView';
import QPDropDownMenu from './QPDropDownMenu';
import {
  generateEmailDraft,
  generateRefineEmailDraft,
} from '../../../redux/actions/closedloop.actions';
import QPLoader from '../../../widgets/QPLoader';
import QPAIIcon from '../../../../assets/images/qp_ai.svg';
import RegenerateIcon from '../../../../assets/images/regenerate_icon.svg';
import DropDownButton from './DropDownButton';

const RenderAILogo = () => {
  return (
    <StartAlignedView>
      <View style={styles.aiLogoContainer}>
        <QPAIIcon />
      </View>
    </StartAlignedView>
  );
};

const RenderLoadingSpinner = ({isLoading}) => {
  if (!isLoading) {
    return null;
  }
  return (
    <View style={styles.loading}>
      <QPLoader spinnerText={'Generating....'} />
    </View>
  );
};

function RegenerateButton({onPress}) {
  return (
    <Pressable onPress={onPress}>
      {/* <IonIcon name="refresh" size={28} color={Colors.accentLight} /> */}
      <RegenerateIcon
        height={MarginConstants.tab1_3x}
        width={MarginConstants.tab1_3x}
        color={Colors.accentLight}
      />
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
        flexDirection: 'row',
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
        marginVertical: MarginConstants.tab1,
        paddingVertical: PaddingConstants.tab1,
        alignItems: 'center',
        justifyContent: 'space-between',
        flexDirection: 'row',
      }}>
      {children}
    </View>
  );
}

const AIEmailDraftModal = ({onClose, setEmailBody}) => {
  const [isLoading, setIsLoading] = useState(true);

  const {response, context} = useSelector(
    state => state.dashboard.generatedEmailDraftResponse,
  );
  const defaultDropDownButtonText = 'Refine';
  const [draftType, setDraftType] = useState(defaultDropDownButtonText);
  const customerName = useSelector(
    state => state.dashboard?.ticket?.panelMember?.name,
  );
  const ticketId = useSelector(state => state.dashboard?.ticket?.id);
  const [currentDraft, setCurrentDraft] = useState({});
  const {feedbackID} = useSelector(state => state.global.userInfo);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);
  const [dropDownPosition, setDropDownPosition] = useState({x: 0, y: 0});

  const dropDownItems = ['shorten', 'formalize', 'elaborate'];
  const [drafts, setDrafts] = useState(new Map());
  const dispatch = useDispatch();

  const getEmailDraft = () => {
    setIsLoading(true);
    dispatch(
      generateEmailDraft(
        {
          customerName: customerName ?? '',
        },
        ticketId,
        feedbackID,
      ),
    );
  };

  const getRefinedEmailDraft = (item, context_, subject, body) => {
    setIsLoading(true);
    dispatch(
      generateRefineEmailDraft({
        refine: item,
        context: context_,
        subject: subject,
        body: body,
      }),
    );
  };

  const updateUI = response_ => {
    setCurrentDraft(response_);
  };

  const setData = response_ => {
    setDrafts(state => state.set(response_.refine, response_));
  };
  useEffect(() => {
    setIsLoading(false);
    if (context && response) {
      updateUI(response);
      setData(response);
    }
  }, [context, response]);

  useEffect(() => {
    console.log('generateEmailDraft', ticketId, feedbackID);
    getEmailDraft();
  }, []);

  const onPressInsert = () => {
    console.log('onPressInsert', draftType, JSON.stringify(currentDraft));

    setEmailBody({
      ...currentDraft,
    });
    onClose();
  };
  const onPressRegenerate = () => {
    console.log('onPressRegenerate');
    setDraftType(defaultDropDownButtonText);
    getEmailDraft();
  };

  const onPressDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const onDropDownButtonLayout = event => {
    const layout = event.nativeEvent.layout;
    console.log('onDropDownButtonLayout', layout);
    setDropDownPosition(position => ({
      ...position,
      x: MarginConstants.tab1_2x + MarginConstants.halfTab,
      y: layout.height + MarginConstants.tab1_4x,
    }));
  };

  const onSelectDropDownItem = type => {
    setDraftType(type);

    getRefinedEmailDraft(
      type,
      context,
      drafts.get(REFINE_DEFAULT),
      drafts.get(REFINE_DEFAULT),
    );
  };

  return (
    <View style={styles.modalBody}>
      <RenderLoadingSpinner isLoading={isLoading} />
      <RenderAILogo />
      <EmailBodyTextView text={currentDraft.body ?? ''} />

      <EmailGenarationActionContainer>
        <StartAlignedView>
          <DropDownButton
            hasIcon={true}
            label={draftType}
            onPress={onPressDropDown}
            isOpen={isDropDownOpen}
            onLayout={onDropDownButtonLayout}
          />
        </StartAlignedView>

        <EndAlignedView>
          <RegenerateButton onPress={onPressRegenerate} />
          <HorizontalSpaceBox multiplyBy={3} />
          <InsertButton onPress={onPressInsert} />
        </EndAlignedView>
      </EmailGenarationActionContainer>

      <QPDropDownMenu
        visible={isDropDownOpen}
        onClose={() => setIsDropDownOpen(false)}
        anchorPosition={dropDownPosition}
        anchorType="bottom"
        items={dropDownItems}
        onSelectItem={onSelectDropDownItem}
        selectedItem={draftType}
      />
    </View>
  );
};

export default AIEmailDraftModal;

const styles = StyleSheet.create({
  modalBody: {
    flex: 1,
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
    zIndex: 2,
    backgroundColor: Colors.white,
  },
  chipButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    margin: MarginConstants.tab1_2x,
    padding: PaddingConstants.tab1_2x,
  },
  aiLogoContainer: {
    marginVertical: MarginConstants.tab1,
    padding: PaddingConstants.tab1,
    backgroundColor: Colors.settingsBackground,
    borderRadius: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dropDownButton: {
    flexDirection: 'row',
    marginEnd: MarginConstants.tab1_4x,
    backgroundColor: Colors.white,
    padding: PaddingConstants.tab1,
    width: MarginConstants.tab1_16x + MarginConstants.tab1_4x,
    borderWidth: 1,
    borderRadius: 2,
    borderColor: Colors.borderColor,
    alignItems: 'center',
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
    marginHorizontal: MarginConstants.tab1_2x,
  },
});
