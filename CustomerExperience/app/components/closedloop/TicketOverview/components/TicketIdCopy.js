import React from 'react';
import {Pressable, View} from 'react-native';
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
import {SubText, Title} from '../../ui/ShowTitleAndText';
import {MarginConstants} from '../../../../styles/margin.constants';
const TicketIdCopy = () => {
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
    <View>
      <Title text={'Ticket ID:'} />
      <Pressable
        testID="copy-ticket-id-title-button"
        style={styles.container}
        onPress={onPress}>
        <SubText text={`Ticket #${ticketId}`} />
        <HorizontalSpaceBox />
        <View style={styles.copyIcon}>
          <CopyIcon size={16} tintColor={Colors.accentLight} />
        </View>
      </Pressable>
    </View>
  );
};

export default TicketIdCopy;

const styles = {
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: PaddingConstants.halfTab,
  },
  copyIcon: {
    marginBottom: MarginConstants.halfTab,
  },
};
