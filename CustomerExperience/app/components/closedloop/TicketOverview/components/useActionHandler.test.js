import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useActionHandler from './useActionHandler';

jest.mock('../../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockNavigate = jest.fn();
jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({navigate: mockNavigate}),
}));

const mockStore = configureStore([]);
const makeStore = (ticket = {id: 1, panelMember: {email: 'a@b.com'}}) =>
  mockStore({dashboard: {ticket}});

const wrapper = ({children}) => (
  <Provider store={makeStore()}>{children}</Provider>
);

describe('useActionHandler', () => {
  beforeEach(() => jest.clearAllMocks());

  it('returns actionDataList and handleTicketAction', () => {
    const {result} = renderHook(() => useActionHandler(), {wrapper});
    expect(result.current.actionDataList).toHaveLength(1);
    expect(typeof result.current.handleTicketAction).toBe('function');
  });

  it('navigates to sendEmail when action id=1', () => {
    const {result} = renderHook(() => useActionHandler(), {wrapper});
    act(() => {
      result.current.handleTicketAction({id: 1});
    });
    expect(mockNavigate).toHaveBeenCalledWith('sendEmail', expect.any(Object));
  });

  it('navigates to sendEmail on default case', () => {
    const {result} = renderHook(() => useActionHandler(), {wrapper});
    act(() => {
      result.current.handleTicketAction({id: 99});
    });
    expect(mockNavigate).toHaveBeenCalled();
  });

  it('handles case 2 (promptCall) without throwing', () => {
    const {result} = renderHook(() => useActionHandler(), {wrapper});
    expect(() => {
      act(() => {
        result.current.handleTicketAction({id: 2});
      });
    }).not.toThrow();
  });

  it('handles case 3 (promptSms) without throwing', () => {
    const {result} = renderHook(() => useActionHandler(), {wrapper});
    expect(() => {
      act(() => {
        result.current.handleTicketAction({id: 3});
      });
    }).not.toThrow();
  });
});
