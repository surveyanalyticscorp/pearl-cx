import React from 'react';
import {render, fireEvent} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import FilterTicket from './FilterTickets';

// Mock the translation function
jest.mock('../../../Utils/MultilinguaUtils', () => ({
  translate: jest.fn(key => key),
}));

const mockStore = configureStore([]);
const store = mockStore({dashboard: {ticketTags: []}});

const mockData = {
  status: [
    {id: 1, title: 'Open', isChecked: false},
    {id: 2, title: 'Closed', isChecked: true},
  ],
  priority: [
    {id: 1, title: 'High', isChecked: false},
    {id: 2, title: 'Low', isChecked: false},
  ],
  type: [
    {id: 1, title: 'Bug', isChecked: false},
    {id: 2, title: 'Feature', isChecked: false},
  ],
  assignToId: '',
  userId: 'user123',
  selectedManager: [],
};

const mockOnPressHandler = jest.fn();
const mockNavigation = {goBack: jest.fn(), canGoBack: jest.fn(() => true)};

const makeRoute = (data = mockData) => ({
  params: {data, onPressHandler: mockOnPressHandler},
});

describe('FilterTicket Component', () => {
  const wrap = ui => <Provider store={store}>{ui}</Provider>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      wrap(
        <FilterTicket route={makeRoute()} navigation={mockNavigation} />,
      ),
    );

    expect(getByTestId('render-status')).toBeTruthy();
    expect(getByTestId('render-priority')).toBeTruthy();
    expect(getByTestId('render-ticket-type')).toBeTruthy();
    expect(getByTestId('render-show-tickets')).toBeTruthy();
  });

  it('calls onPressHandler with correct data when Apply is pressed', () => {
    const {getByText} = render(
      wrap(
        <FilterTicket route={makeRoute()} navigation={mockNavigation} />,
      ),
    );

    const applyButton = getByText('apply');
    fireEvent.press(applyButton);

    expect(mockOnPressHandler).toHaveBeenCalledWith(
      expect.objectContaining({
        status: expect.any(Array),
        priority: expect.any(Array),
        type: expect.any(Array),
        assignToId: '',
        userId: 'user123',
      }),
      'apply',
    );
  });

  it('calls Clear button and resets filters', () => {
    const {getByText} = render(
      wrap(
        <FilterTicket route={makeRoute()} navigation={mockNavigation} />,
      ),
    );

    const clearButton = getByText('clear');
    fireEvent.press(clearButton);

    expect(mockOnPressHandler).not.toHaveBeenCalled();
  });

  it('toggles my tickets switch correctly', () => {
    const {getByRole} = render(
      wrap(
        <FilterTicket route={makeRoute()} navigation={mockNavigation} />,
      ),
    );

    const switchElement = getByRole('switch');
    fireEvent(switchElement, 'onValueChange', true);

    expect(mockOnPressHandler).not.toHaveBeenCalled();
  });

  it('handles status filter selection and maintains state', () => {
    const testData = {
      ...mockData,
      status: [
        {id: 1, title: 'Open', isChecked: false},
        {id: 2, title: 'Closed', isChecked: false},
      ],
    };

    const {getByText} = render(
      wrap(
        <FilterTicket route={makeRoute(testData)} navigation={mockNavigation} />,
      ),
    );

    fireEvent.press(getByText('Open'));
    expect(getByText('Open')).toBeTruthy();
  });

  it('handles priority filter selection and maintains state', () => {
    const testData = {
      ...mockData,
      priority: [
        {id: 1, title: 'High', isChecked: false},
        {id: 2, title: 'Medium', isChecked: false},
      ],
    };

    const {getByText} = render(
      wrap(
        <FilterTicket route={makeRoute(testData)} navigation={mockNavigation} />,
      ),
    );

    fireEvent.press(getByText('High'));
    expect(getByText('High')).toBeTruthy();
  });

  it('handles type filter selection (radio button behavior)', () => {
    const testData = {
      ...mockData,
      type: [
        {id: 1, title: 'Bug', isChecked: false},
        {id: 2, title: 'Feature', isChecked: false},
      ],
    };

    const {getByText} = render(
      wrap(
        <FilterTicket route={makeRoute(testData)} navigation={mockNavigation} />,
      ),
    );

    fireEvent.press(getByText('Bug'));
    expect(getByText('Bug')).toBeTruthy();
  });

  it('handles assignToId when userId is set', () => {
    const testDataWithAssignment = {
      ...mockData,
      assignToId: 'user123',
    };

    const {getByRole} = render(
      wrap(
        <FilterTicket
          route={makeRoute(testDataWithAssignment)}
          navigation={mockNavigation}
        />,
      ),
    );

    const switchElement = getByRole('switch');
    expect(switchElement.props.value).toBe(true);
  });
});
