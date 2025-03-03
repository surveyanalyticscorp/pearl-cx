import {renderHook, act} from '@testing-library/react-hooks';
import {useDispatch, useSelector} from 'react-redux';
import useUpdateTicket from './useUpdateTicket';
import {updateClfTicket} from '../../../../redux/actions/dashboard.actions';
import {sendAnalyticsEvent} from '../../../../Utils/AnalyticLogs';
import {ANALYTICS_EVENTS} from '../../../../Utils/Analytic.constants';

jest.mock('react-redux', () => ({
  useDispatch: jest.fn(),
  useSelector: jest.fn(),
}));

jest.mock('../../../../redux/actions/dashboard.actions', () => ({
  updateClfTicket: jest.fn(),
}));

jest.mock('../../../../Utils/AnalyticLogs', () => ({
  sendAnalyticsEvent: jest.fn(),
}));

describe('useUpdateTicket Hook', () => {
  let dispatchMock;

  beforeEach(() => {
    dispatchMock = jest.fn();
    useDispatch.mockReturnValue(dispatchMock);
    useSelector.mockImplementation(selector =>
      selector({
        global: {
          authToken: 'mockAuthToken',
          userInfo: {
            emailAddress: 'user@example.com',
            firstName: 'John',
            lastName: 'Doe',
            userID: 'user123',
            feedbackApiKey: 'mockFeedbackApiKey',
          },
        },
        dashboard: {
          ticket: {id: 456},
        },
      }),
    );

    sendAnalyticsEvent.mockClear();
    updateClfTicket.mockClear();
  });

  it('should initialize the hook without errors', () => {
    const {result} = renderHook(() => useUpdateTicket());
    expect(result.current).toBeInstanceOf(Function);
  });

  it('should dispatch updateClfTicket with correct parameters', () => {
    const {result} = renderHook(() => useUpdateTicket());

    const params = {status: 'resolved', priority: 'high'};

    act(() => {
      result.current(params); // Calling the function returned by the hook
    });

    expect(sendAnalyticsEvent).toHaveBeenCalledTimes(1);
    expect(sendAnalyticsEvent).toHaveBeenCalledWith(
      ANALYTICS_EVENTS.UPDATE_TICKET,
      {
        ticketId: 456,
        ...params,
        userName: 'John Doe',
        userEmailAddress: 'user@example.com',
        userId: 'user123',
      },
    );

    expect(dispatchMock).toHaveBeenCalledTimes(1);
    expect(dispatchMock).toHaveBeenCalledWith(
      updateClfTicket(
        'mockAuthToken',
        {
          ...params,
          userName: 'John Doe',
          userEmailAddress: 'user@example.com',
          userId: 'user123',
        },
        456,
        'mockFeedbackApiKey',
      ),
    );
  });
});
