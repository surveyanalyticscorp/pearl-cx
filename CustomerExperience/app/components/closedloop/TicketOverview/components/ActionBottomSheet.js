import React, {useCallback} from 'react';
import {useNavigation} from '@react-navigation/native';
import {useSelector} from 'react-redux';
import BottomSheet from 'reanimated-bottom-sheet';
import {StyleSheet, View} from 'react-native';
import BottomSheetHeader from '../../../../routes/commonUI/BottomSheetHeader';
import {translate} from '../../../../Utils/MultilinguaUtils';
import TicketTakeAction from '../../takeaction/TIcketTakeAction';
import {Colors} from '../../../../styles/color.constants';
import {PaddingConstants} from '../../../../styles/padding.constants';

const ActionBottomSheet = React.forwardRef(({fall}, ref) => {
  const {panelMember, id} = useSelector(state => state.dashboard.ticket);
  const navigation = useNavigation();
  const snapPoints = ['33%', '0%'];
  const renderHeader = () => {
    return (
      <BottomSheetHeader
        title={translate('ticket_overview.take_action')}
        onPressClose={() => ref.current.snapTo(snapPoints.length - 1)}
      />
    );
  };

  const renderTicketTakeAction = () => {
    const data = [
      {
        id: 1,
        title: translate('action_email.respond_via_email'),
        icon: 'email',
      },
    ];

    return (
      <View style={styles.contentContainer}>
        <TicketTakeAction
          data={data}
          handleOnPress={item => handleTicketAction(item)}
        />
      </View>
    );
  };

  const navigateToSendEmail = () => {
    ref.current.snapTo(snapPoints.length - 1);
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

  return (
    <BottomSheet
      ref={ref}
      snapPoints={snapPoints}
      initialSnap={snapPoints.length - 1}
      renderContent={renderTicketTakeAction}
      renderHeader={renderHeader}
      callbackNode={fall}
    />
  );
});

export default ActionBottomSheet;

const styles = StyleSheet.create({
  contentContainer: {
    backgroundColor: Colors.white,
    paddingHorizontal: PaddingConstants.tab1,
    height: '100%',
  },
});
