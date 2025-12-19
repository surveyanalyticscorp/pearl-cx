import React from 'react';
import {StyleSheet, View} from 'react-native';
import {useSelector} from 'react-redux';
import DescriptionHeader from './DescriptionHeader';
import {translate} from '../../../../Utils/MultilinguaUtils';
import {ChildContainer} from '../../../../widgets/ParentContainer';
import ShowTitleAndText from '../../ui/ShowTitleAndText';
import TakeActionButton from './TakeActionButton';
import {Colors} from '../../../../styles/color.constants';
import {MarginConstants} from '../../../../styles/margin.constants';
import {PaddingConstants} from '../../../../styles/padding.constants';

const ContactView = ({children}) => {
  const {panelMember} = useSelector(state => state.dashboard.ticket);

  return (
    <View testID="contact-view" style={[styles.ticketStatusContainer]}>
      <DescriptionHeader text={translate('ticket_overview.contact')} />
      <ChildContainer style={{paddingHorizontal: 0}}>
        <ShowTitleAndText
          title={`${'Name'}`}
          subText={
            panelMember?.name?.length > 0
              ? panelMember.name
              : translate('ticket_list.anonymous')
          }
        />
        {panelMember?.email?.length > 0 ? (
          <ShowTitleAndText
            title={`${translate('responses.email')}`}
            subText={panelMember?.email}
            isSubtextHighlighted={false}
          />
        ) : (
          <View />
        )}
        {panelMember?.phone?.length > 0 ? (
          <ShowTitleAndText
            title={`${translate('create_new_ticket.phone_number')}`}
            subText={panelMember?.phone}
            isSubtextHighlighted={false}
          />
        ) : (
          <View />
        )}

        {children}
      </ChildContainer>
      <TakeActionButton />
    </View>
  );
};

export default ContactView;

const styles = StyleSheet.create({
  ticketStatusContainer: {
    backgroundColor: Colors.white,
    marginHorizontal: MarginConstants.tab1,
    marginTop: MarginConstants.tab1,
    marginBottom: MarginConstants.halfTab,
    padding: PaddingConstants.tab1_2x,
    borderRadius: 4,
  },
});
