import {useNavigation} from '@react-navigation/native';
import React from 'react';
import {useCallback} from 'react';
import {useSelector} from 'react-redux';
import {translate} from '../../../../Utils/MultilinguaUtils';

const useActionHandler = () => {
  const actionDataList = [
    {id: 1, title: translate('action_email.respond_via_email'), icon: 'email'},
  ];
  const {panelMember, id} = useSelector(state => state.dashboard.ticket);
  const navigation = useNavigation();

  const navigateToSendEmail = () => {
    navigation.navigate('sendEmail', {
      toEmail: panelMember?.email ?? '',
      ticketId: id,
    });
  };

  const promptCall = () => {
    console.log('call');
  };

  const promptSms = () => {
    console.log('SMS');
  };

  const handleTicketAction = useCallback(item => {
    switch (item.id) {
      case 1:
        navigateToSendEmail();
        break;
      case 2:
        promptCall();
        break;
      case 3:
        promptSms();
        break;
      default:
        navigateToSendEmail();
        break;
    }
  }, []);

  return {
    handleTicketAction,
    actionDataList,
  };
};

export default useActionHandler;
