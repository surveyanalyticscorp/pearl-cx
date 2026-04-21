import React from 'react';
import {Dimensions} from 'react-native';
import EmailActionContainer from './EmailActionContainer';
import RefineButton from './RefineButton';
import RegenerateButton from './RegenerateButton';
import InsertButton from './InsertButton';
import {HorizontalSpaceBox} from '../../../../widgets/SpaceBox';
import EndAlignedView from '../../../../routes/commonUI/EndAlignedView';
import StartAlignedView from '../../../../routes/commonUI/StartAlignedView';

const isSmallScreen = Dimensions.get('window').width <= 375;

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
        isSmallScreen={isSmallScreen}
      />
    </StartAlignedView>
    <EndAlignedView>
      <RegenerateButton onPress={onPressRegenerate} isSmallScreen={isSmallScreen} />
      <InsertButton onPress={onPressInsert} isSmallScreen={isSmallScreen} />
    </EndAlignedView>
  </EmailActionContainer>
);

export default EmailActionBar;
