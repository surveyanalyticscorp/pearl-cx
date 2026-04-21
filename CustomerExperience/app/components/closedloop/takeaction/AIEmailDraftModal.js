import React, {useEffect, useState} from 'react';
import {StyleSheet, View} from 'react-native';
import {Colors} from '../../../styles/color.constants';
import {PaddingConstants} from '../../../styles/padding.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {FontFamily} from '../../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {REFINE_DEFAULT} from '../../../api/Constant';
import StringUtils from '../../../Utils/StringUtils';
import {MarginConstants} from '../../../styles/margin.constants';
import {EmailBodyTextView} from './sendEmail/AiEmailBodyTextView';
import QPBottomSheet from './QPBottomSheet';
import RefineOptionsSheet from './RefineOptionsSheet';
import {
  generateEmailDraft,
  generateRefineEmailDraft,
} from '../../../redux/actions/closedloop.actions';
import QPLoader from '../../../widgets/QPLoader';
import RenderAILogo from './sendEmail/RenderAILogo';
import EmailActionBar from './sendEmail/EmailActionBar';

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

const AIEmailDraftModal = ({onClose, setEmailBody}) => {
  const [isLoading, setIsLoading] = useState(true);

  const {response, context} = useSelector(
    state => state.dashboard.generatedEmailDraftResponse,
  );
  const [selectedRefineOptions, setSelectedRefineOptions] = useState({
    refine: null,
    intent: null,
  });
  const customerName = useSelector(
    state => state.dashboard?.ticket?.panelMember?.name,
  );
  const ticketId = useSelector(state => state.dashboard?.ticket?.id);
  const [currentDraft, setCurrentDraft] = useState({});
  const {feedbackID} = useSelector(state => state.global.userInfo);
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

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
        refine: StringUtils.toSnakeCase(item.refine),
        intent: StringUtils.toSnakeCase(item.intent),
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
    getEmailDraft();
  }, []);

  const onPressInsert = () => {
    setEmailBody({
      ...currentDraft,
    });
    onClose();
  };
  const onPressRegenerate = () => {
    setSelectedRefineOptions({refine: null, intent: null});
    getEmailDraft();
  };

  const onPressDropDown = () => {
    setIsDropDownOpen(!isDropDownOpen);
  };

  const onSelectDropDownItem = options => {
    setSelectedRefineOptions(options);
    getRefinedEmailDraft(
      options,
      context,
      drafts.get(REFINE_DEFAULT).subject,
      drafts.get(REFINE_DEFAULT).body,
    );
  };

  return (
    <View style={styles.modalBody}>
      <RenderLoadingSpinner isLoading={isLoading} />
      <RenderAILogo />
      <EmailBodyTextView text={currentDraft.body ?? ''} />

      <EmailActionBar
        selectedRefineOptions={selectedRefineOptions}
        onPressDropDown={onPressDropDown}
        isDropDownOpen={isDropDownOpen}
        onPressRegenerate={onPressRegenerate}
        onPressInsert={onPressInsert}
      />

      <QPBottomSheet
        bottomSheetHeight="80%"
        visible={isDropDownOpen}
        onClose={() => setIsDropDownOpen(false)}>
        <RefineOptionsSheet
          selectedItem={selectedRefineOptions}
          onSelectItem={onSelectDropDownItem}
          onClose={() => setIsDropDownOpen(false)}
        />
      </QPBottomSheet>
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
