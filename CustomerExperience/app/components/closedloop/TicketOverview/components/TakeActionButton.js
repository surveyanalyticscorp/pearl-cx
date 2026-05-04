import React from 'react';
import {View} from 'react-native';
import QPButton from '../../../../widgets/Button';
import {buttonStyles} from '../../../../styles/button.styles';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {Colors} from '../../../../styles/color.constants';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {useSelector} from 'react-redux';
import {isObjectEmpty} from '../../../../Utils/Utility';
import useActionNavigation from '../../../../hooks/useNavigation';

export function hasPanelMemberObj(obj) {
  return obj !== null && obj !== undefined && !isObjectEmpty(obj);
}

const TakeActionButton = () => {
  const panelMember = useSelector(state => state.dashboard.ticket.panelMember);
  const hasPanelMember = hasPanelMemberObj(panelMember);
  const {navigateToSendEmail} = useActionNavigation();
  return (
    <View style={styles.takeActionContainer}>
      <QPButton
        disabled={!hasPanelMember}
        testID="TakeActionButton"
        buttonColor={hasPanelMember ? Colors.white : Colors.filterIconColor}
        style={buttonStyles.outlinePrimaryButton}
        onPress={navigateToSendEmail}
        buttonText={translate('action_email.respond_via_email')}
        textStyle={buttonStyles.outlinePrimaryButtonText}
      />
    </View>
  );
};

export default TakeActionButton;

const styles = {
  takeActionContainer: {
    paddingTop: PaddingConstants.tab1,
  },
};
