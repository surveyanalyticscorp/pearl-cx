import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {SegmentSearchHeader} from './SegmentSearchHeader';

jest.mock('react-native-vector-icons/Ionicons', () => 'IonIcons');
jest.mock('../../Utils/MultilinguaUtils', () => ({translate: jest.fn(k => k)}));

describe('SegmentSearchHeader', () => {
  const mockOnSearch = jest.fn();
  const mockOnClear = jest.fn();

  beforeEach(() => jest.clearAllMocks());

  it('renders search input', () => {
    const {getByTestId} = render(
      <SegmentSearchHeader onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    expect(getByTestId('search-input')).toBeTruthy();
  });

  it('updates text as user types', () => {
    const {getByTestId} = render(
      <SegmentSearchHeader onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    fireEvent.changeText(getByTestId('search-input'), 'hello');
    expect(getByTestId('search-input').props.value).toBe('hello');
  });

  it('calls onSearch on submit when text is non-empty', () => {
    const {getByTestId} = render(
      <SegmentSearchHeader onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    fireEvent.changeText(getByTestId('search-input'), 'seg');
    fireEvent(getByTestId('search-input'), 'submitEditing', {
      nativeEvent: {text: 'seg'},
    });
    expect(mockOnSearch).toHaveBeenCalledWith('seg');
  });

  it('calls onClear on submit when text is empty', () => {
    const {getByTestId} = render(
      <SegmentSearchHeader onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    fireEvent(getByTestId('search-input'), 'submitEditing', {
      nativeEvent: {text: ''},
    });
    expect(mockOnClear).toHaveBeenCalled();
  });

  it('calls onClear and clears text when clear button is pressed', () => {
    const {getByTestId} = render(
      <SegmentSearchHeader onSearch={mockOnSearch} onClear={mockOnClear} />,
    );
    fireEvent.changeText(getByTestId('search-input'), 'hello');
    fireEvent.press(getByTestId('clear-button'));
    expect(mockOnClear).toHaveBeenCalled();
    expect(getByTestId('search-input').props.value).toBe('');
  });
});
