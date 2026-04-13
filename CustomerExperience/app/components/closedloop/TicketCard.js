import React from 'react';
import {StyleSheet, Pressable} from 'react-native';
import {Colors} from '../../styles/color.constants';
import {MarginConstants} from '../../styles/margin.constants';
import {PaddingConstants} from '../../styles/padding.constants';
import {useSelector} from 'react-redux';
import {translate} from '../../Utils/MultilinguaUtils';
import TopRow from './ticketCard/TopRow';
import CommentText from './ticketCard/CommentText';
import BottomRow from './ticketCard/BottomRow';

export default function TicketCard({data, index, onPressHandler}) {
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);

  const getAssigneeName = (assignToId_, owners_) => {
    const owner = owners_.find(({ownerID}) => ownerID === assignToId_);
    return owner ? owner['ownerName'] : 'Not Available';
  };

  const email =
    data?.panelMember?.email ??
    data?.panelMember?.name ??
    translate('ticket_list.anonymous');
  const hasPanelMember = email !== translate('ticket_list.anonymous');

  return (
    <Pressable
      testID="ticket-card"
      onPress={() => {
        onPressHandler(data, index);
      }}
      style={styles.container}>
      <TopRow
        email={email}
        hasPanelMember={hasPanelMember}
        ticketId={data?.id}
      />
      <CommentText comment={data?.comment} />
      <BottomRow
        name={getAssigneeName(data?.assignToId, owners)}
        issueDate={data?.issueDate}
        isOverdue={data?.isOverdue}
        priority={data?.priority}
        status={data?.status}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: MarginConstants.tab1_2x,
    marginVertical: MarginConstants.tab1,
    padding: PaddingConstants.tab1_2x,
    borderRadius: 8,
    borderColor: Colors.darkGrey,
    borderWidth: 1,
    backgroundColor: Colors.white,
  },
});
