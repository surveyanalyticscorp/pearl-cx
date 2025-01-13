import React, {useEffect} from 'react';
import {View} from 'react-native';
import {useSelector} from 'react-redux';
import {useNavigation} from '@react-navigation/native';
import useDeleteAlert from '../hooks/useDeleteAlert';
import QPButton from '../../../../widgets/Button';
import {Colors} from '../../../../styles/color.constants';
import {buttonStyles} from '../../../../styles/button.styles';
import {MarginConstants} from '../../../../styles/margin.constants';
import {translate} from '../../../../Utils/MultilinguaUtils';

export const DeleteView = () => {
  const [setDeleteAlertVisibility] = useDeleteAlert();
  const {ticketDeleteStatus} = useSelector(state => state.dashboard);
  const navigation = useNavigation();
  const hasPermission = useSelector(
    state => state.global.globalSettings.managerDeletePermission,
  );

  useEffect(() => {
    if (
      ticketDeleteStatus.status &&
      ticketDeleteStatus.status.trim() === 'success'
    ) {
      navigation.goBack();
      console.log('GO BACK!!!');
    }
  }, [navigation, ticketDeleteStatus]);

  return hasPermission ? (
    <QPButton
      testID="DeleteButtonAction"
      buttonColor={Colors.white}
      style={[
        buttonStyles.deleteButton,
        {borderRadius: 2, margin: MarginConstants.tab1},
      ]}
      onPress={() => setDeleteAlertVisibility(true)}
      buttonText={translate('ticket_overview.delete_ticket')}
      textStyle={buttonStyles.deleteButtonText}
    />
  ) : (
    <View />
  );
};

export default DeleteView;
