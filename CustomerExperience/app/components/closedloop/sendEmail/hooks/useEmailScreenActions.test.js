import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useEmailScreenActions from './useEmailScreenActions';

jest.mock('@react-navigation/native', () => ({
  useNavigation: () => ({goBack: jest.fn()}),
}));

jest.mock('../../../../redux/actions/closedloop.actions', () => ({
  getActionHistorySummary: jest.fn((token, id) => ({
    type: 'GET_ACTION_HISTORY_SUMMARY',
    token,
    id,
  })),
  getActionHistoryDetails: jest.fn((token, id) => ({
    type: 'GET_ACTION_HISTORY_DETAILS',
    token,
    id,
  })),
  resetSendEmailResponse: jest.fn(() => ({type: 'RESET_SEND_EMAIL_RESPONSE'})),
  resetSendEmailError: jest.fn(() => ({type: 'RESET_SEND_EMAIL_ERROR'})),
}));

const mockStore = configureStore([]);

const makeStore = (emailOverrides = {}) =>
  mockStore({
    global: {authToken: 'token-123'},
    dashboard: {
      emailData: {
        emailSentResponse: null,
        emailSendError: false,
        emailTemplates: [],
        ...emailOverrides,
      },
    },
  });

const mockRichTextRef = {
  current: {
    setContentHTML: jest.fn(),
    insertLink: jest.fn(),
    dismissKeyboard: jest.fn(),
  },
};

const mockSetBody = jest.fn();

const wrapper = store =>
  ({children}) =>
    <Provider store={store}>{children}</Provider>;

describe('useEmailScreenActions', () => {
  beforeEach(() => jest.clearAllMocks());

  it('dispatches action history actions on mount', () => {
    const store = makeStore();
    renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    const actions = store.getActions();
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GET_ACTION_HISTORY_SUMMARY'}),
    );
    expect(actions).toContainEqual(
      expect.objectContaining({type: 'GET_ACTION_HISTORY_DETAILS'}),
    );
  });

  it('initially all bottom sheets are hidden', () => {
    const store = makeStore();
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    expect(result.current.isEmailDraftBottomSheetVisible).toBe(false);
    expect(result.current.isTemplateBottomSheetVisible).toBe(false);
    expect(result.current.isInsertLinkModalVisible).toBe(false);
    expect(result.current.overlayStatus).toBeNull();
  });

  it('onPressAiButton opens AI email draft bottom sheet', () => {
    const store = makeStore();
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    act(() => result.current.onPressAiButton());
    expect(result.current.isEmailDraftBottomSheetVisible).toBe(true);
  });

  it('onCloseAiEmailDraftBottomSheet closes AI bottom sheet', () => {
    const store = makeStore();
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    act(() => result.current.onPressAiButton());
    act(() => result.current.onCloseAiEmailDraftBottomSheet());
    expect(result.current.isEmailDraftBottomSheetVisible).toBe(false);
  });

  it('handleTemplateSelectAction sets body and closes template sheet', () => {
    const store = makeStore();
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    act(() =>
      result.current.handleTemplateSelectAction({
        templateText: '<p>Hello</p>',
      }),
    );
    expect(mockSetBody).toHaveBeenCalled();
    expect(mockRichTextRef.current.setContentHTML).toHaveBeenCalledWith(
      '<p>Hello</p>',
    );
    expect(result.current.isTemplateBottomSheetVisible).toBe(false);
  });

  it('setAIEmailDraft updates body and editor', () => {
    const store = makeStore();
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    act(() =>
      result.current.setAIEmailDraft({body: '<p>Draft</p>', subject: 'Sub'}),
    );
    expect(mockSetBody).toHaveBeenCalled();
    expect(mockRichTextRef.current.setContentHTML).toHaveBeenCalledWith(
      '<p>Draft</p>',
    );
  });

  it('sets overlayStatus to success when emailSentResponse is success', () => {
    const store = makeStore({emailSentResponse: {status: 'success'}});
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    expect(result.current.overlayStatus).toBe('success');
  });

  it('sets overlayStatus to error when emailSendError is true', () => {
    const store = makeStore({emailSendError: true});
    const {result} = renderHook(
      () =>
        useEmailScreenActions({
          ticketId: 'T1',
          setBody: mockSetBody,
          richTextRef: mockRichTextRef,
        }),
      {wrapper: wrapper(store)},
    );
    expect(result.current.overlayStatus).toBe('error');
  });
});
