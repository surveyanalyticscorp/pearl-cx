import React from 'react';
import {StyleSheet, View} from 'react-native';
import {MarginConstants} from '../../../styles/margin.constants';
import {translate} from '../../../Utils/MultilinguaUtils';
import {buttonStyles} from '../../../styles/button.styles';
import QPButton from '../../../widgets/Button';

const RenderCreateTicketButton = ({handleCreateTicket}) => {
  return (
    <View style={styles.buttonStyle}>
      <QPButton
        onPress={handleCreateTicket}
        buttonText={translate('create_new_ticket.create_new_ticket')}
        textStyle={buttonStyles.primaryButtonText}
        style={buttonStyles.primaryButton}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  buttonStyle: {
    flex: 1,
    alignItems: 'stretch',
    justifyContent: 'center',
    marginVertical: MarginConstants.tab1,
  },
});

export default RenderCreateTicketButton;
