import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import EmailSubject from './EmailSubject';

jest.mock('../../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));

describe('EmailSubject', () => {
  it('renders subject placeholder', () => {
    const {getByPlaceholderText} = render(
      <EmailSubject body={{subject: ''}} onChangeSubject={jest.fn()} />,
    );
    expect(getByPlaceholderText('Email subject')).toBeTruthy();
  });

  it('shows default value from body.subject', () => {
    const {getByDisplayValue} = render(
      <EmailSubject body={{subject: 'Hello'}} onChangeSubject={jest.fn()} />,
    );
    expect(getByDisplayValue('Hello')).toBeTruthy();
  });

  it('calls onChangeSubject when text changes', () => {
    const mockChange = jest.fn();
    const {getByPlaceholderText} = render(
      <EmailSubject body={{subject: ''}} onChangeSubject={mockChange} />,
    );
    fireEvent.changeText(getByPlaceholderText('Email subject'), 'New Subject');
    expect(mockChange).toHaveBeenCalledWith('New Subject');
  });
});
