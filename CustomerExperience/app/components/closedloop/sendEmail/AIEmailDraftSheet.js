import React from 'react';
import {QPBottomSheet, QPBottomSheetHeader} from '../../../widgets/QPBottomSheet';
import AIEmailDraftModal from './AIEmailDraftModal';

const AIEmailDraftSheet = ({visible, onClose, onSetEmailBody}) => {
  return (
    <QPBottomSheet
      visible={visible}
      onClose={onClose}
      bottomSheetHeight="90%"
      headerComponent={
        <QPBottomSheetHeader
          headerLabel="Draft with QuestionPro AI"
          onClose={onClose}
        />
      }>
      <AIEmailDraftModal onClose={onClose} setEmailBody={onSetEmailBody} />
    </QPBottomSheet>
  );
};

export default AIEmailDraftSheet;
