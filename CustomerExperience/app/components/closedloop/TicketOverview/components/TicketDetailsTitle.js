import React from 'react';
import {Pressable} from 'react-native';
import {useSelector} from 'react-redux';
import {PaddingConstants} from '../../../../styles/padding.constants';
import TextLabel from '../../../../widgets/TextLabel/TextLabel';
import {showInfoFlashMessage} from '../../../../Utils/Utility';
import {translate} from '../../../../Utils/MultilinguaUtils';
import Clipboard from '@react-native-clipboard/clipboard';
import {CopyIcon} from '../../../../routes/commonUI/CommonUI';
import {Colors} from '../../../../styles/color.constants';
import {baseTextStyles} from '../../../../styles/text.styles';
import {HorizontalSpaceBox} from '../../../../widgets/SpaceBox';
const TicketDetailsTitle = () => {
  const ticketId = useSelector(state => state.dashboard.ticket.id);

  const onPress = () => {
    Clipboard.setString(JSON.stringify(ticketId));
    showInfoFlashMessage(translate('close_loop.copied_success'));
  };

  if (ticketId == null) {
    return (
      <TextLabel
        style={baseTextStyles.largeRegularText}
        color={Colors.white}
        text={'Ticket details'}
      />
    );
  }
  return (
    <Pressable
      testID="copy-ticket-id-title-button"
      style={styles.container}
      onPress={onPress}>
      <TextLabel
        style={baseTextStyles.largeRegularText}
        color={Colors.white}
        text={`Ticket #${ticketId}`}
      />
      <HorizontalSpaceBox />
      <CopyIcon size={14} tintColor={Colors.white} />
    </Pressable>
  );
};

export default TicketDetailsTitle;

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: PaddingConstants.halfTab,
  },
};
