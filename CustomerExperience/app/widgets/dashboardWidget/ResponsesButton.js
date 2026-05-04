import {useNavigation} from '@react-navigation/native';
import React from 'react';
import QPButton from '../Button';
import {buttonStyles} from '../../styles/button.styles';
import {translate} from '../../Utils/MultilinguaUtils';

const ResponsesButton = () => {
  let navigation = useNavigation();
  const navigateToResponses = () => {
    navigation.navigate('dashboard_to_responses');
  };

  return (
    <QPButton
      testID="dashboardToResponseButton"
      style={buttonStyles.textButton}
      onPress={navigateToResponses}
      buttonText={translate('dashboard.responses')}
      textStyle={buttonStyles.textButtonTextPrimary}
    />
  );
};

export default ResponsesButton;
