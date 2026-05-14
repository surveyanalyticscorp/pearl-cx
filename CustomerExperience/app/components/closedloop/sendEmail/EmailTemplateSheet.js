import React from 'react';
import {QPBottomSheet, QPBottomSheetHeader} from '../../../widgets/QPBottomSheet';
import SelectEmailTemplate from './SelectEmailTemplate';

const EmailTemplateSheet = ({visible, onClose, emailTemplates, onSelectTemplate}) => {
  return (
    <QPBottomSheet
      visible={visible}
      onClose={onClose}
      bottomSheetHeight="40%"
      headerComponent={
        <QPBottomSheetHeader headerLabel="Select template" onClose={onClose} />
      }>
      <SelectEmailTemplate
        data={emailTemplates}
        handleOnPress={onSelectTemplate}
      />
    </QPBottomSheet>
  );
};

export default EmailTemplateSheet;
