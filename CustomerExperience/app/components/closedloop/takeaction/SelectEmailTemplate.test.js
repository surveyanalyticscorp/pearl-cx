import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import SelectEmailTemplate from './SelectEmailTemplate';

describe('SelectEmailTemplate Component', () => {
  const mockData = [
    {title: 'Template 1'},
    {title: 'Template 2'},
    {title: 'Template 3'},
  ];

  const mockHandleOnPress = jest.fn();

  it('renders SelectEmailTemplate component correctly', () => {
    const {getByText} = render(
      <SelectEmailTemplate data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Check that all template titles are rendered
    expect(getByText('Template 1')).toBeTruthy();
    expect(getByText('Template 2')).toBeTruthy();
    expect(getByText('Template 3')).toBeTruthy();
  });

  it('calls handleOnPress when a template is pressed', () => {
    const {getByText} = render(
      <SelectEmailTemplate data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Press the first template
    fireEvent.press(getByText('Template 1'));

    // Expect the mock function to have been called with the correct item
    expect(mockHandleOnPress).toHaveBeenCalledWith({title: 'Template 1'});
  });

  it('renders the correct number of templates', () => {
    const {getAllByText} = render(
      <SelectEmailTemplate data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Ensure all templates are rendered
    const templates = getAllByText(/Template/);
    expect(templates.length).toBe(3);
  });

  it('renders the FlatList with the correct data', () => {
    const {getByText} = render(
      <SelectEmailTemplate data={mockData} handleOnPress={mockHandleOnPress} />,
    );

    // Ensure FlatList renders the correct items
    expect(getByText('Template 1')).toBeTruthy();
    expect(getByText('Template 2')).toBeTruthy();
    expect(getByText('Template 3')).toBeTruthy();
  });
});
