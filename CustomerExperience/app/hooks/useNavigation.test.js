import {renderHook, act} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import React from 'react';
import useActionNavigation from './useNavigation';

const mockNavigate = jest.fn();
const mockGoBack = jest.fn();
const mockReplace = jest.fn();
const mockReset = jest.fn();
const mockPush = jest.fn();
const mockPop = jest.fn();

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    goBack: mockGoBack,
    replace: mockReplace,
    reset: mockReset,
    push: mockPush,
    pop: mockPop,
  }),
}));

const mockStore = configureStore([]);
const makeStore = () =>
  mockStore({
    dashboard: {
      ticket: {id: 42, panelMember: {email: 'agent@test.com'}},
    },
  });

const wrapper = store => ({children}) => (
  <Provider store={store}>{children}</Provider>
);

describe('useActionNavigation', () => {
  beforeEach(() => jest.clearAllMocks());

  it('navigateToSendEmail calls navigation.navigate with sendEmail route', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.navigateToSendEmail());
    expect(mockNavigate).toHaveBeenCalledWith('sendEmail', {
      toEmail: 'agent@test.com',
      ticketId: 42,
    });
  });

  it('navigateTo calls navigate with screenName and params', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.navigateTo('Details', {id: 1}));
    expect(mockNavigate).toHaveBeenCalledWith('Details', {id: 1});
  });

  it('goBack calls navigation.goBack', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.goBack());
    expect(mockGoBack).toHaveBeenCalled();
  });

  it('replace calls navigation.replace', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.replace('Home', {}));
    expect(mockReplace).toHaveBeenCalledWith('Home', {});
  });

  it('reset calls navigation.reset', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    const config = {index: 0, routes: [{name: 'Home'}]};
    act(() => result.current.reset(config));
    expect(mockReset).toHaveBeenCalledWith(config);
  });

  it('push calls navigation.push', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.push('Screen', {x: 1}));
    expect(mockPush).toHaveBeenCalledWith('Screen', {x: 1});
  });

  it('pop calls navigation.pop with default count 1', () => {
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(makeStore()),
    });
    act(() => result.current.pop());
    expect(mockPop).toHaveBeenCalledWith(1);
  });

  it('navigateToSendEmail uses empty string when panelMember is null', () => {
    const store = mockStore({
      dashboard: {ticket: {id: 10, panelMember: null}},
    });
    const {result} = renderHook(() => useActionNavigation(), {
      wrapper: wrapper(store),
    });
    act(() => result.current.navigateToSendEmail());
    expect(mockNavigate).toHaveBeenCalledWith('sendEmail', {
      toEmail: '',
      ticketId: 10,
    });
  });
});
