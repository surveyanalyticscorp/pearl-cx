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
  {title: 'Overdue', id: 3},
  {title: 'Resolved', id: 4},
];

export const getStatusById = (statusId) => {
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
  statusList.forEach((element) => {
    if (element.id === statusId) {
      title = element.title;
    }
  });
  return title;
};

export const getPriorityById = (priorityId) => {
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
  priorityList.forEach((element) => {
    if (element.id === priorityId) {
      console.log(priorityId, element.title);
      title = element.title;
    }
  });
  return title;
};

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
