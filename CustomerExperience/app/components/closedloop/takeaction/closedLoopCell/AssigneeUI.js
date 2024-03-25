import React from 'react';
import {View} from 'react-native';
import StringUtils from '../../../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {closedLoopStyles} from '../../closeloop.style';
import {Avatar} from '../../../../routes/CommonScreen';

const AssigneeUI = ({assignToId}) => {
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);

  // console.log('OWNERS_', JSON.stringify(owners), JSON.stringify(assignToId));
  function getAssigneeName(assignToId, owners_) {
    if (StringUtils.isEmptyOrNull(assignToId)) {
      return assignToId;
    }
    const owner = owners_.find(e => e.ownerID === assignToId);
    return owner['ownerName'] ?? '';
  }

  const title = getAssigneeName(assignToId, owners);

  return (
    <View style={closedLoopStyles.AssigneeUI}>
      <Avatar title={title} />
      {/* <Text style={styles.statusText}>{title}</Text> */}
    </View>
  );
};

export default AssigneeUI;
