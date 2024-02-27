import React, {Image} from 'react';
import {RenderStatusIcon, ResponsesIcon} from '../routes/CommonScreen';
import StringUtils from './StringUtils';

export const wordsToBold = [
  'HIGH',
  'LOW',
  'CRITICAL',
  'MEDIUM',
  'NEW',
  'OPEN',
  'RESOLVED',
  'ESCALATED',
  'overdue',
];

export const priorityList = [
  {title: 'Low', id: 0},
  {title: 'Medium', id: 1},
  {title: 'High', id: 2},
  {title: 'Critical', id: 3},
];

export const statusList = [
  {title: 'New', id: 0},
  {title: 'Open', id: 1},
  {title: 'Escalated', id: 2},
  // {title: 'Overdue', id: 3},
  {title: 'Resolved', id: 3},
];

export const statusListDashboardClosedLoopFilter = [
  {title: 'All', id: 0},

  {title: 'New', id: 1},
  {title: 'Open', id: 2},
  {title: 'Escalated', id: 3},
  // {title: 'Overdue', id: 3},
  {title: 'Resolved', id: 4},
];

export const statusListForCreateTicket = [
  {title: 'New', id: 0},
  {title: 'Open', id: 1},
  // {title: 'Escalated', id: 2},
  // {title: 'Overdue', id: 3},
  {title: 'Resolved', id: 3},
];

export const ticketTypeList = [
  {title: 'Manual ticket', id: 0},
  {title: 'Detractor alert', id: 1},
];

export const getTicketTypeById = typeId => {
  let title = ticketTypeList[0].title;
  ticketTypeList.forEach(element => {
    if (element.id === typeId) {
      title = element.title;
    }
  });
  return title;
};

export const getStatusById = statusId => {
  //   switch (statusId) {
  //     case 0:
  //       return 'New';
  //     case 1:
  //       return 'Open';
  //     case 2:
  //       return 'Escalated';
  //     case 3:
  //       return 'Overdue';
  //     case 4:
  //       return 'Resolved';
  //     default:
  //       return 'New';
  //   }
  let title = statusList[0].title;
  statusList.forEach(element => {
    if (element.id === statusId) {
      title = element.title;
    }
  });
  return title;
};

export const getPriorityById = priorityId => {
  //   switch (priorityId) {
  //     case 0:
  //       return 'Low';
  //     case 1:
  //       return 'Medium';
  //     case 2:
  //       return 'High';
  //     case 3:
  //       return 'Critical';
  //     default:
  //       return 'Low';
  //   }
  let title = priorityList[0].title;
  priorityList.forEach(element => {
    if (element.id === priorityId) {
      console.log(priorityId, element.title);
      title = element.title;
    }
  });
  return title;
};

export const getSegmentNameById = (segmentList, segmentId) => {
  let title = 'Segment';
  segmentList.forEach(element => {
    if (element.segmentID === segmentId) {
      title = element.segmentName;
    }
  });

  return title;
};

export const getOwnerNameById = (owners, ownerId) => {
  let title = 'Owner';
  owners.forEach(element => {
    if (element.ownerID === ownerId) {
      title = element.ownerName;
    }
  });

  return title;
};

export const getStatusIndexById = statusId => {
  let index = -1;
  statusList.forEach((element, i) => {
    if (element.id === statusId) {
      index = i;
    }
  });

  return index;
};

export const getPriorityIndexById = priorityId => {
  let index = -1;
  statusList.forEach((element, i) => {
    if (element.id === priorityId) {
      index = i;
    }
  });

  return index;
};

export const getSegmentIndex = (segmentlist, segmentId) => {
  let index = 0;
  segmentlist.forEach((element, index_) => {
    if (element.segmentID === segmentId) {
      index = index_;
    }
  });
  return index;
};

export const getSegmentBySegmentId = (segmentlist, segmentId) => {
  let item = {};
  segmentlist.forEach(element => {
    if (element.segmentID === segmentId) {
      item = element;
    }
  });
  return item;
};

export const getOwnerIndex = (ownerlist, ownnerId) => {
  let index_ = -1;
  ownerlist.forEach((element, index) => {
    if (element.ownerID === ownnerId) {
      index_ = index;
    }
  });
  return index_;
};

export function getDashboardStatusList(ticketCount) {
  const getAll = getAllTicketCount(ticketCount);

  let temp = [];
  Object.keys(ticketCount).forEach(value => {
    if (ticketCount.hasOwnProperty(value)) {
      temp.push({
        label: StringUtils.uppercaseFirstCharRestLowercase(value),
        value: value.toLowerCase(),
        count: ticketCount[value],
        icon: () => <RenderStatusIcon title={value} />,
      });
    }
  });

  temp.push({
    label: 'All',
    value: 'all',
    count: getAll,
    icon: () => <ResponsesIcon />,
  });
  return temp;
}

export function getDashboardStatusListForBottomList(ticketCount) {
  if (!ticketCount) {
    return [];
  }
  const getAll = getAllTicketCount(ticketCount);

  let temp = [];

  temp.push({
    label: 'All',
    title: 'All',
    value: 'all',
    id: 0,
    count: getAll,
    icon: () => <ResponsesIcon />,
  });

  Object.keys(ticketCount).forEach((value, index) => {
    if (ticketCount.hasOwnProperty(value)) {
      temp.push({
        label: StringUtils.uppercaseFirstCharRestLowercase(value),
        title: StringUtils.uppercaseFirstCharRestLowercase(value),
        value: value.toLowerCase(),
        count: ticketCount[value],
        id: index + 1, // incresed ID value to acomodate all object
        icon: () => <RenderStatusIcon title={value} />,
      });
    }
  });

  return temp;
}

export function getAllTicketCount(ticketCount_) {
  const totalCount = Object.values(ticketCount_).reduce((total, current) => {
    let temp = {};
    Object.keys(current).forEach(key => {
      if (current.hasOwnProperty(key)) {
        temp = {...temp, [key]: total[key] + current[key]};
      }
    });
    return temp;
  });
  return totalCount;
}
// const statusList = {
//   'NEW' : 0,
//   'OPEN' : 1,
//   'ESCALATED' : 2,
//   'OVERDUE' : 3,
//   'RESOLVED' : 4,
// }
// const getStatusTitle = (value)=>{
//   return Object.keys(statusList)[value]
// }
// console.log(getStatusTitle(2))
// console.log(getStatusTitle(0))

// export enum Status {
//     NEW = 0,
//     OPEN = 1,
//     ESCALATED = 2,
//     OVERDUE = 3,
//     RESOLVED = 4,
//   }

//   export enum Priority {
//     LOW = 0,
//     MEDIUM = 1,
//     HIGH = 2,
//     CRITICAL = 3,
//   }
export function getUniqueValues(arr, key) {
  const unique = [];
  const distinctPropertyValues = [];

  for (let i = 0; i < arr.length; i++) {
    if (!unique[arr[i][key]]) {
      distinctPropertyValues.push(arr[i]);
      unique[arr[i][key]] = 1;
    }
  }

  return distinctPropertyValues;
}

export const getNameInitials = title => {
  const nameArray = title.trim().split(/[. ]/);
  return nameArray.length > 1
    ? nameArray
        .map(item => item[0].toUpperCase())
        .join('')
        .slice(0, 2)
    : nameArray[0].length > 1
    ? nameArray[0].slice(0, 2)
    : nameArray[0];
};

export const getTrimmedNoOfResponses = responseCount => {
  let numberOfResponses = responseCount ? responseCount : 0;

  if (numberOfResponses >= 10000) {
    numberOfResponses =
      Math.round(numberOfResponses / 1000).toFixed(
        numberOfResponses > 10000 ? 0 : 1,
      ) + 'K';
  } else if (numberOfResponses >= 1000) {
    numberOfResponses = (numberOfResponses / 1000).toFixed(1) + 'K';
  }
  return numberOfResponses;
};
