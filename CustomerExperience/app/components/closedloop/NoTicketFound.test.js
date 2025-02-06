import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import NoTicketFound from './NoTicketFound';

describe('NoTicketFound Component', () => {
  it('renders correctly with expected elements', () => {
    const {getByTestId, getByText, getByA11yLabel, getByA11yHint} = render(
      <NoTicketFound onPressReset={jest.fn()} />,
    );

    // Ensure the container is rendered
    expect(getByTestId('no-ticket-found')).toBeTruthy();

    // Ensure the correct text is displayed
    expect(getByText('Oops! No tickets found')).toBeTruthy();
    expect(getByText('Try using a different filter criteria')).toBeTruthy();
    expect(getByText('Reset filters')).toBeTruthy();

    // Accessibility checks
    // expect(getByA11yLabel('No tickets found')).toBeTruthy();
    expect(getByA11yHint('Try using a different filter criteria')).toBeTruthy();
  });

  it('triggers onPressReset when the reset button is pressed', () => {
    const mockReset = jest.fn();
    const {getByText} = render(<NoTicketFound onPressReset={mockReset} />);

    const resetButton = getByText('Reset filters');
    fireEvent.press(resetButton);

    expect(mockReset).toHaveBeenCalledTimes(1);
  });
});
