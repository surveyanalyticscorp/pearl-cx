'use strict';

import { apiHandler } from '../../global/api/APIHandler';
import praise from './Praise';
import * as _ from 'lodash';

export function fetchPraises(requestData) {
  // const goals = require('./Goals');

  return dispatch => {
    dispatch({
      type: 'PRAISE',
      data: praise
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

export function updatePraises(data) {
  return dispatch => {
    dispatch({
      type: 'PRAISE',
      data
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

export function addNewBadge(selectedBadge) {
  return dispatch => {
    dispatch({
      type: 'PRAISE_NEW_BADGE',
      data: { add: true, selectedBadge }
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

export function hideBadgeModal(selectedBadge) {
  return dispatch => {
    dispatch({
      type: 'PRAISE_NEW_BADGE',
      data: { add: false, badgeAssigned: false, selectedBadge }
    });
  };
}

export function selectedBadgeUser(praises, userBadges, selectedUser, badge) {
  const userId = selectedUser.id;
  const comment = selectedUser.comment;
  const selectedBadge = badge.selectedBadge;
  const updatedPraises = getUpdatedPraises(praises, userId, comment, selectedBadge);

  const updatedBadges = getUpdatedBadges(
    userBadges,
    selectedBadge.id,
    global.appUser.ID,
    userId,
    comment
  );

  return dispatch => {
    dispatch({
      type: 'PRAISE_NEW_BADGE',
      data: { add: false, selectedUser, selectedBadge: badge.selectedBadge, badgeAssigned: true }
    });

    dispatch({
      type: 'PRAISE',
      data: updatedPraises
    });

    dispatch({
      type: 'USER_BADGES',
      data: updatedBadges
    });

    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

// function updatePraises(data) {
//   return dispatch => {
//     dispatch({
//       type: 'PRAISE',
//       data
//     });
//     // TODO For api call
//     //return apiHandler.getFlashLetGoals(dispatch, requestData);
//   };
// }

function updateBadges(data) {
  return dispatch => {
    dispatch({
      type: 'USER_BADGES',
      data
    });
    // TODO For api call
    //return apiHandler.getFlashLetGoals(dispatch, requestData);
  };
}

function getQuarterPraise(praises, year, quarter) {
  return _.find(praises, praise => praise.quarter === quarter && praise.year === year);
}

function getUpdatedBadges(userBadges, badgeId, fromId, toId, comment) {
  if (!_.isArray(userBadges)) {
    userBadges = [];
    userBadges.push({
      userid: toId,
      badges: [{ id: badgeId, users: [{ id: fromId, comment: comment }] }]
    });
  } else {
    let selectedUser = _.find(userBadges, userBadge => userBadge.userid === toId);

    if (selectedUser) {
      let userBadges = _.isArray(selectedUser.badges) ? selectedUser.badges : [];

      let selectedUserBadgeIndex = _.findIndex(userBadges, badge => badge.id === badgeId);

      if (selectedUserBadgeIndex !== -1) {
        let userBadge = userBadges[selectedUserBadgeIndex];

        if (!_.isArray(userBadge.users)) {
          userBadge.users = [];
        }

        userBadge.users.push(fromId);
      } else {
        if (!_.isArray(selectedUser.badges)) {
          selectedUser.badges = [];
        }
        selectedUser.badges.push({ id: badgeId, users: [{ id: fromId, comment: comment }] });
      }
    } else {
      userBadges.push({
        userid: toId,
        badges: [{ id: badgeId, users: [{ id: fromId, comment: comment }] }]
      });
    }
  }

  return userBadges;
}

function getUpdatedPraises(praises, userId, comment, badge) {
  let quarterPraises = getQuarterPraise(praises, badge.year, badge.quarter);

  if (quarterPraises && quarterPraises.praises) {
    let selectedPraises = quarterPraises.praises;

    let selectedPraise = _.find(selectedPraises, praise => praise.id === badge.id);

    if (selectedPraise) {
      selectedPraise.praiseUsers.push({ from: global.appUser.ID, to: userId, comment });
    }
  }

  return praises;
}
