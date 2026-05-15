import {renderHook, act} from '@testing-library/react-native';
import React from 'react';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import useEmailDraft from './useEmailDraft';

jest.mock('./useDraftGeneration', () => () => ({
  isLoading: false,
  currentDraft: {subject: 'Draft subject', body: 'Draft body'},
  context: 'ctx',
  drafts: {default: {subject: 'DS', body: 'DB'}},
  getEmailDraft: jest.fn(),
  getRefinedEmailDraft: jest.fn(),
}));

const mockStore = configureStore([]);
const wrapper = ({children}) => (
  <Provider store={mockStore({dashboard: {generatedEmailDraftResponse: null}})}>{children}</Provider>
);

describe('useEmailDraft', () => {
  const mockOnClose = jest.fn();
  const mockSetEmailBody = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('initializes with dropdown closed', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    expect(result.current.isDropDownOpen).toBe(false);
  });

  it('initializes with null refine options', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    expect(result.current.selectedRefineOptions).toEqual({refine: null, intent: null});
  });

  it('onPressDropDown toggles dropdown open', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    act(() => result.current.onPressDropDown());
    expect(result.current.isDropDownOpen).toBe(true);
  });

  it('onCloseDropDown closes dropdown', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    act(() => result.current.onPressDropDown());
    act(() => result.current.onCloseDropDown());
    expect(result.current.isDropDownOpen).toBe(false);
  });

  it('onPressInsert calls setEmailBody and onClose', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    act(() => result.current.onPressInsert());
    expect(mockSetEmailBody).toHaveBeenCalled();
    expect(mockOnClose).toHaveBeenCalled();
  });

  it('onPressRegenerate resets refine options', () => {
    const {result} = renderHook(
      () => useEmailDraft({onClose: mockOnClose, setEmailBody: mockSetEmailBody}),
      {wrapper},
    );
    act(() => result.current.onSelectDropDownItem({refine: 'short', intent: 'confirm'}));
    act(() => result.current.onPressRegenerate());
    expect(result.current.selectedRefineOptions).toEqual({refine: null, intent: null});
  });
});
