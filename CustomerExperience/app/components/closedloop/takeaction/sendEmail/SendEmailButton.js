import React from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import {IonIcon} from '../../../../Utils/IconUtils';
import useSendEmail from './hooks/useSendEmail';

const SendEmailButton = ({emailBody}) => {
  const {handleSend} = useSendEmail(emailBody);

  return (
    <Pressable onPress={handleSend} style={styles.optionIcon}>
      <IonIcon
        name={'send'}
        size={22}
        color={Colors.accentLight}
        style={{transform: [{rotateZ: '-45deg'}]}}
        testID={'send-icon-button'}
      />
    </Pressable>
  );
};

export default SendEmailButton;

const styles = StyleSheet.create({
  optionIcon: {
    marginHorizontal: MarginConstants.tab1,
    marginTop: -MarginConstants.halfTab,
  },
});
