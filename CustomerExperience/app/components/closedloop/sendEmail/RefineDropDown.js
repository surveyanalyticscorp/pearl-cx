import React from 'react';
import DropDownButton from '../takeaction/DropDownButton';

const RefineDropDown = ({selectedRefineOptions, onPress, isOpen}) => (
  <DropDownButton
    hasIcon={true}
    label={selectedRefineOptions?.refine ?? 'Refine'}
    onPress={onPress}
    isOpen={isOpen}
  />
);

export default RefineDropDown;
