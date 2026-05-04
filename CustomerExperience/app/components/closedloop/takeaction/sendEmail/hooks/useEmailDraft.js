import {useState} from 'react';
import {REFINE_DEFAULT} from '../../../../../api/Constant';
import useDraftGeneration from './useDraftGeneration';

const useEmailDraft = ({onClose, setEmailBody}) => {
  const [selectedRefineOptions, setSelectedRefineOptions] = useState({
    refine: null,
    intent: null,
  });
  const [isDropDownOpen, setIsDropDownOpen] = useState(false);

  const {
    isLoading,
    currentDraft,
    context,
    drafts,
    getEmailDraft,
    getRefinedEmailDraft,
  } = useDraftGeneration();

  const onPressInsert = () => {
    setEmailBody({...currentDraft});
    onClose();
  };

  const onPressRegenerate = () => {
    setSelectedRefineOptions({refine: null, intent: null});
    getEmailDraft();
  };

  const onPressDropDown = () => setIsDropDownOpen(prev => !prev);

  const onCloseDropDown = () => setIsDropDownOpen(false);

  const onSelectDropDownItem = options => {
    setSelectedRefineOptions(options);
    getRefinedEmailDraft(
      options,
      context,
      drafts[REFINE_DEFAULT]?.subject,
      drafts[REFINE_DEFAULT]?.body,
    );
  };

  return {
    isLoading,
    currentDraft,
    selectedRefineOptions,
    isDropDownOpen,
    onPressInsert,
    onPressRegenerate,
    onPressDropDown,
    onCloseDropDown,
    onSelectDropDownItem,
  };
};

export default useEmailDraft;
