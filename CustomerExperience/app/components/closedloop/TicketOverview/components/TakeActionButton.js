import React from 'react';
import {View} from 'react-native';
import QPButton from '../../../../widgets/Button';
import {buttonStyles} from '../../../../styles/button.styles';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {Colors} from '../../../../styles/color.constants';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {useSelector} from 'react-redux';
import {isObjectEmpty} from '../../../../Utils/Utility';

export function hasPanelMemberObj(obj) {
  return obj !== null && obj !== undefined && !isObjectEmpty(obj);
}

const TakeActionButton = ({onTakeActionHandler}) => {
  const panelMember = useSelector(state => state.dashboard.ticket.panelMember);
  const hasPanelMember = hasPanelMemberObj(panelMember);

  return (
    <View style={styles.takeActionContainer}>
      <QPButton
        disabled={!hasPanelMember}
        testID="TakeActionButton"
        buttonColor={
          hasPanelMember ? Colors.accentLight : Colors.filterIconColor
        }
        style={buttonStyles.primaryButton}
        onPress={onTakeActionHandler}
        buttonText={translate('ticket_overview.take_action')}
        textStyle={buttonStyles.primaryButtonText}
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
