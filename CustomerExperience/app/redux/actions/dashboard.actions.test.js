import * as actions from './dashboard.actions';
import {
  GET_DASHBOARD,
  DASHBOARD_RECEIVED,
  GET_DETRACTOR_TICKET,
  DETRACTOR_TICKET_RECEIVED,
  GET_CLOSED_LOOP_TICKET_DETAILS,
  CLOSED_LOOP_TICKET_DETAILS_RECEIVED,
  CLEAR_CLOSED_LOOP_TICKET_DETAILS,
  GET_CLOSED_LOOP_SEGMENT_DETAILS,
  GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
  FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  GET_CLOSED_LOOP_OWNER_DETAILS,
  GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
  CLOSED_LOOP_SEGMENT_DETAILS_RECEIVED,
  CLOSED_LOOP_OWNER_DETAILS_RECEIVED,
  CLOSED_LOOP_ALL_OWNERS_DETAILS_RECEIVED,
  UPDATE_TICKET,
  ADD_CLOSED_LOOP_TICKET,
  DASHBOARD_RANGE,
  SEGMENT_SELECTED,
  GET_CLOSED_LOOP_TICKET_LIST,
  CLOSED_LOOP_TICKET_LIST_RECEIVED,
  GET_CLOSED_LOOP_TICKET_ITEM,
  CLOSED_LOOP_TICKET_ITEM_RECEIVED,
  REMOVE_CLOSED_LOOP_TICKET_ITEM,
  GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
  ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
  ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS_RECEIVED,
  GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,
  CLOSED_LOOP_TICKET_ITEM_ACTIVITY_RECEIVED,
  CREATE_CLF_TICKET,
  CREATE_CLF_TICKET_RECIEVED,
  UPDATE_CLF_TICKET,
  UPDATE_CLF_TICKET_RECIEVED,
  GET_WELCOME_SCREEN_DATA,
  WELCOME_SCREEN_DATA_RECIEVED,
  SEGMENT_SELECTOR_OPEN,
  CLEAR_SEGEMENT_LIST,
  APP_LOGIN_COUNTER,
  GET_CLF_BASE_URL,
  GET_PARENT_COMMENT,
  SET_PARENT_COMMENT,
  RESET_PARENT_COMMENT,
  SET_FILTER_BY_STATUS_ID,
  SET_TOKEN_EXPIRED,
  SET_TOKEN_EXPIRE_DATE,
  IS_CSAT_VIEW_TOP_BOX,
  SET_MOVE_NEXT,
} from './dashboard.actions';

describe('Dashboard Actions', () => {
  it('should create an action to get dashboard content', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const segmentId = 'someSegmentId';
    const expectedAction = {
      type: GET_DASHBOARD,
      token,
      param,
      segmentId,
    };
    expect(actions.getDashboardContent(token, param, segmentId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get detractor ticket details', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_CLOSED_LOOP_TICKET_DETAILS,
      token,
      param,
    };
    expect(actions.getDetractorTicketDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to clear detractor ticket details', () => {
    const expectedAction = {
      type: CLEAR_CLOSED_LOOP_TICKET_DETAILS,
    };
    expect(actions.clearDetractorTicketDetails()).toEqual(expectedAction);
  });

  it('should create an action to get closed loop segment details', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_CLOSED_LOOP_SEGMENT_DETAILS,
      token,
      param,
    };
    expect(actions.getClosedLoopSegmentDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get first time closed loop segment details', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_FIRST_TIME_CLOSED_LOOP_SEGMENT_DETAILS,
      token,
      param,
    };
    expect(actions.getFirstTimeClosedLoopSegmentDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get closed loop owner details', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_CLOSED_LOOP_OWNER_DETAILS,
      token,
      param,
    };
    expect(actions.getClosedLoopOwnerDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get closed loop all owners details', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_CLOSED_LOOP_ALL_OWNERS_DETAILS,
      token,
      param,
    };
    expect(actions.getClosedLoopAllOwnersDetails(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to update ticket', () => {
    const expectedAction = {
      type: UPDATE_TICKET,
    };
    expect(actions.updateTicket()).toEqual(expectedAction);
  });

  it('should create an action to add closed loop ticket', () => {
    const expectedAction = {
      type: ADD_CLOSED_LOOP_TICKET,
    };
    expect(actions.addTicket()).toEqual(expectedAction);
  });

  it('should create an action to get closed loop ticket list', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const feedbackId = 'someFeedbackId';
    const segmentId = 'someSegmentId';
    const expectedAction = {
      type: GET_CLOSED_LOOP_TICKET_LIST,
      token,
      param,
      feedbackId,
      segmentId,
    };
    expect(
      actions.getClosedLoopTicketList(token, param, feedbackId, segmentId),
    ).toEqual(expectedAction);
  });

  it('should create an action to get closed loop ticket item', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: GET_CLOSED_LOOP_TICKET_ITEM,
      token,
      ticketId,
      feedbackApiKey,
    };
    expect(
      actions.getClosedLoopTicketItem(token, ticketId, feedbackApiKey),
    ).toEqual(expectedAction);
  });

  it('should create an action to remove ticket item data', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: REMOVE_CLOSED_LOOP_TICKET_ITEM,
      token,
      ticketId,
    };
    expect(actions.removeTicketItemData(token, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get closed loop ticket item comments', () => {
    const token = 'someToken';
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: GET_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
      token,
      ticketId,
    };
    expect(actions.getClosedLoopTicketItemComments(token, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to get closed loop ticket item activity', () => {
    const ticketId = 'someTicketId';

    const expectedAction = {
      type: GET_CLOSED_LOOP_TICKET_ITEM_ACTIVITY,

      ticketId,
    };
    expect(actions.getClosedLoopTicketItemActivity(ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to add ticket comment', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const ticketId = 'someTicketId';
    const expectedAction = {
      type: ADD_CLOSED_LOOP_TICKET_ITEM_COMMENTS,
      token,
      param,
      ticketId,
    };
    expect(actions.postAddTicketComment(token, param, ticketId)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set parent comment', () => {
    const comment = 'someComment';
    const expectedAction = {
      type: SET_PARENT_COMMENT,
      parentComment: comment,
    };
    expect(actions.setParentComment(comment)).toEqual(expectedAction);
  });

  it('should create an action to reset parent comment', () => {
    const expectedAction = {
      type: RESET_PARENT_COMMENT,
    };
    expect(actions.resetParentComment()).toEqual(expectedAction);
  });

  it('should create an action to create CLF ticket', () => {
    const param = {key: 'value'};
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: CREATE_CLF_TICKET,

      param,
      feedbackApiKey,
    };
    expect(actions.createClfTicket(param, feedbackApiKey)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to update CLF ticket', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const ticketId = 'someTicketId';
    const feedbackApiKey = 'someFeedbackApiKey';
    const expectedAction = {
      type: UPDATE_CLF_TICKET,
      token,
      param,
      ticketId,
      feedbackApiKey,
    };
    expect(
      actions.updateClfTicket(token, param, ticketId, feedbackApiKey),
    ).toEqual(expectedAction);
  });

  it('should create an action to get welcome screen data count', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_WELCOME_SCREEN_DATA,
      token,
      param,
    };
    expect(actions.getWelcomeScreenDataCount(token, param)).toEqual(
      expectedAction,
    );
  });

  it('should create an action to set segment', () => {
    const segment = 'someSegment';
    const expectedAction = {
      type: SEGMENT_SELECTED,
      segment: segment,
    };
    expect(actions.setSegment(segment)).toEqual(expectedAction);
  });

  it('should create an action to set segment selector open', () => {
    const isOpen = true;
    const expectedAction = {
      type: SEGMENT_SELECTOR_OPEN,
      isOpen: isOpen,
    };
    expect(actions.setSegmentSelectorOpen(isOpen)).toEqual(expectedAction);
  });

  it('should create an action to clear segment list', () => {
    const expectedAction = {
      type: CLEAR_SEGEMENT_LIST,
    };
    expect(actions.clearSegmentList()).toEqual(expectedAction);
  });

  it('should create an action to call app login counter', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: APP_LOGIN_COUNTER,
      token,
      param,
    };
    expect(actions.callAppLoginCounter(token, param)).toEqual(expectedAction);
  });

  it('should create an action to get CLF base URL', () => {
    const token = 'someToken';
    const param = {key: 'value'};
    const expectedAction = {
      type: GET_CLF_BASE_URL,
      token,
      param,
    };
    expect(actions.getCLFBaseURL(token, param)).toEqual(expectedAction);
  });

  it('should create an action to set status index', () => {
    const currentStatusIndex = 1;
    const expectedAction = {
      type: SET_FILTER_BY_STATUS_ID,
      currentStatusIndex,
    };
    expect(actions.setStatusIndex(currentStatusIndex)).toEqual(expectedAction);
  });

  it('should create an action to set token expired', () => {
    const isExpired = true;
    const expectedAction = {
      type: SET_TOKEN_EXPIRED,
      isTokenExpired: isExpired,
    };
    expect(actions.setTokenExpired(isExpired)).toEqual(expectedAction);
  });

  it('should create an action to set token expiration date', () => {
    const date = '2024-12-31';
    const expectedAction = {
      type: SET_TOKEN_EXPIRE_DATE,
      date: date,
    };
    expect(actions.setExpirationDate(date)).toEqual(expectedAction);
  });

  it('should create an action to toggle CSAT view', () => {
    const isTopBoxView = true;
    const expectedAction = {
      type: IS_CSAT_VIEW_TOP_BOX,
      isTopBoxView: isTopBoxView,
    };
    expect(actions.toggleCsatView(isTopBoxView)).toEqual(expectedAction);
  });

  it('should create an action to set move next', () => {
    const doesMoveNext = true;
    const expectedAction = {
      type: SET_MOVE_NEXT,
      doesMoveNext: doesMoveNext,
    };
    expect(actions.setMoveNext(doesMoveNext)).toEqual(expectedAction);
  });
});
