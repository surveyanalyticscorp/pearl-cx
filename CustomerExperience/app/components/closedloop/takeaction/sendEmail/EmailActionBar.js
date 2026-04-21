import React from 'react';
import EmailActionContainer from './EmailActionContainer';
import RefineButton from './RefineButton';
import RegenerateButton from './RegenerateButton';
import InsertButton from './InsertButton';
import {HorizontalSpaceBox} from '../../../../widgets/SpaceBox';
import EndAlignedView from '../../../../routes/commonUI/EndAlignedView';
import StartAlignedView from '../../../../routes/commonUI/StartAlignedView';

const EmailActionBar = ({
  selectedRefineOptions,
  onPressDropDown,
  isDropDownOpen,
  onPressRegenerate,
  onPressInsert,
}) => (
  <EmailActionContainer>
    <StartAlignedView>
      <RefineButton
        selectedRefineOptions={selectedRefineOptions}
        onPress={onPressDropDown}
        isOpen={isDropDownOpen}
      />
    </StartAlignedView>
    <EndAlignedView>
      <RegenerateButton onPress={onPressRegenerate} />
      <InsertButton onPress={onPressInsert} />
    </EndAlignedView>
  </EmailActionContainer>
);

export default EmailActionBar;
