import React from 'react';
import DropDownButton from '../DropDownButton';

const RefineDropDown = ({selectedRefineOptions, onPress, isOpen}) => (
  <DropDownButton
    hasIcon={true}
    label={selectedRefineOptions?.refine ?? 'Refine'}
    onPress={onPress}
    isOpen={isOpen}
  />
);

export default RefineDropDown;
