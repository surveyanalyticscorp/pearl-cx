import React from 'react';
import {Pressable, View} from 'react-native';
import Clipboard from '@react-native-clipboard/clipboard';

import {useSelector} from 'react-redux';
import {showInfoFlashMessage} from '../../../../Utils/Utility';
import {PaddingConstants} from '../../../../styles/padding.constants';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {CopyIcon} from '../../../../routes/commonUI/CommonUI';
import {Colors} from '../../../../styles/color.constants';
const CopyTicketIdButton = () => {
  const ticketId = useSelector(state => state.dashboard.ticket.id);

  const onPress = () => {
    Clipboard.setString(JSON.stringify(ticketId));
    showInfoFlashMessage(translate('close_loop.copied_success'));
  };

  return (
    <Pressable testID="copy-ticket-id-button" onPress={onPress}>
      <View style={styles.ticketIdView}>
        <CopyIcon size={16} tintColor={Colors.accentLight} />
      </View>
    </Pressable>
  );
};

export default CopyTicketIdButton;

const styles = {
  ticketIdView: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: PaddingConstants.halfTab,
  },
};
