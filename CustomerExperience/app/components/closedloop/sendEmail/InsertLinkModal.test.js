import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import InsertLinkModal from './InsertLinkModal';

const mockInsertLink = jest.fn();
const mockSetVisibility = jest.fn();

const renderModal = (isVisible = true) =>
  render(
    <InsertLinkModal
      isVisible={isVisible}
      setVisiblity={mockSetVisibility}
      insertLink={mockInsertLink}
    />,
  );

describe('InsertLinkModal', () => {
  beforeEach(() => jest.clearAllMocks());

  it('renders modal title when visible', () => {
    const {getByText} = renderModal(true);
    expect(getByText('Insert link')).toBeTruthy();
  });

  it('renders text and link inputs', () => {
    const {getByPlaceholderText} = renderModal(true);
    expect(getByPlaceholderText('Text')).toBeTruthy();
    expect(getByPlaceholderText('Link')).toBeTruthy();
  });

  it('calls insertLink and setVisiblity on submit', () => {
    const {getByPlaceholderText, getByText} = renderModal(true);
    fireEvent.changeText(getByPlaceholderText('Text'), 'Click here');
    fireEvent.changeText(getByPlaceholderText('Link'), 'https://example.com');
    fireEvent.press(getByText('Save'));
    expect(mockInsertLink).toHaveBeenCalledWith(
      'Click here',
      'https://example.com',
    );
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });

  it('calls setVisiblity on cancel', () => {
    const {getByText} = renderModal(true);
    fireEvent.press(getByText('Cancel'));
    expect(mockSetVisibility).toHaveBeenCalledWith(false);
  });
});
