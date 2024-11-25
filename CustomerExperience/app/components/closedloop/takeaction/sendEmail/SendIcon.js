import React, {useCallback} from 'react';
import {Pressable, StyleSheet} from 'react-native';
import {sendEmail} from '../../../../redux/actions/closedloop.actions';
import {useDispatch, useSelector} from 'react-redux';
import StringUtils from '../../../../Utils/StringUtils';
import {showErrorFlashMessage} from '../../../../Utils/Utility';
import {Colors} from '../../../../styles/color.constants';
import {RenderIonIcon} from '../SendEmail';
import {MarginConstants} from '../../../../styles/margin.constants';
import {IonIcon} from '../../../../Utils/IconUtils';

const SendIcon = ({emailBody}) => {
  const {mediaFileList} = useSelector(state => state.dashboard);
  const dispatch = useDispatch();

  const callSendEmailApi = () => {
    let attachments = [];
    if (mediaFileList.length > 0) {
      for (let i = 0; i < mediaFileList.length; i++) {
        attachments[i] = mediaFileList[i].id;
      }
    }
    if (StringUtils.isEmpty(emailBody.subject)) {
      showErrorFlashMessage('Empty email subject');
      return;
    }
    if (StringUtils.isEmpty(emailBody.emailBody)) {
      showErrorFlashMessage('Empty email body');
      return;
    } else {
      console.log('EMAIL BODY: 2', JSON.stringify(emailBody));
      console.log('ATTACHMENTS: 2', JSON.stringify(attachments));

      dispatch(
        sendEmail('', emailBody.ticketId, {
          ...emailBody,
          attachments: attachments,
        }),
      );
    }
  };

  return (
    <Pressable onPress={callSendEmailApi} style={styles.optionIcon}>
      <IonIcon
        name={'send'}
        size={24}
        color={Colors.accentLight}
        style={{transform: [{rotateZ: '-45deg'}]}}
      />
    </Pressable>
  );
};

export default SendIcon;

const styles = StyleSheet.create({
  optionIcon: {
    margin: MarginConstants.tab1,
  },
});
