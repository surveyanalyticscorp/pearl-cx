import React from 'react';
import {View} from 'react-native';
import StringUtils from '../../../../Utils/StringUtils';
import {useSelector} from 'react-redux';
import {closedLoopStyles} from '../../closeloop.style';
import {Avatar} from '../../../../routes/commonUI/CommonUI';

const AssigneeUI = ({assignToId}) => {
  const owners = useSelector(state => state.dashboard.ownerDetails.owners);

  // console.log('OWNERS_', JSON.stringify(owners), JSON.stringify(assignToId));
  function getAssigneeName(assignToId_, owners_) {
    const owner = owners_.find(({ownerID}) => ownerID === assignToId_);
    return owner ? owner['ownerName'] : 'Not Available';
  }

  return (
    <View style={closedLoopStyles.AssigneeUI}>
      <Avatar title={getAssigneeName(assignToId, owners)} />
      {/* <Text style={styles.statusText}>{title}</Text> */}
    </View>
  );
};

export default AssigneeUI;
