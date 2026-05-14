import React from 'react';
import {Dimensions} from 'react-native';
import EmailActionContainer from './EmailActionContainer';
import RefineButton from './RefineButton';
import RegenerateButton from './RegenerateButton';
import {HorizontalSpaceBox} from '../../../widgets/SpaceBox';
import EndAlignedView from '../../../routes/commonUI/EndAlignedView';
import StartAlignedView from '../../../routes/commonUI/StartAlignedView';

const isSmallScreen = Dimensions.get('window').width <= 375;

const EmailActionBar = ({
  selectedRefineOptions,
  onPressDropDown,
  isDropDownOpen,
  onPressRegenerate,
}) => (
  <EmailActionContainer>
    <StartAlignedView>
      <RefineButton
        selectedRefineOptions={selectedRefineOptions}
        onPress={onPressDropDown}
        isOpen={isDropDownOpen}
        isSmallScreen={isSmallScreen}
      />
      <HorizontalSpaceBox multiplyBy={2} />
      <RegenerateButton
        onPress={onPressRegenerate}
        isSmallScreen={isSmallScreen}
      />
    </StartAlignedView>
  </EmailActionContainer>
);

export default EmailActionBar;
