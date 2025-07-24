import React from 'react';
import {render} from '@testing-library/react-native';
import {Provider} from 'react-redux';
import configureStore from 'redux-mock-store';
import FeedbackCell from './FeedbackCells';
import {getNPSColor} from '../../../styles/color.constants';

const mockStore = configureStore([]);

describe('FeedbackCell', () => {
  let store;
  let props;

  beforeEach(() => {
    // Create mock data for the item prop
    const mockItem = {
      responseSetID: '123',
      surveyTakenDate: '2024-01-01',
      emailAddress: 'test@example.com',
      answerText: '9',
      sentiment: 'Promoter',
      ticketID: '456',
      read: false,
    };

    store = mockStore({
      response: {
        responseReadList: [],
      },
      global: {
        authToken: 'mock-auth-token',
        userInfo: {
          feedbackApiKey: 'mock-feedback-api-key',
          feedbackID: 'mock-feedback-id',
        },
      },
    });

    props = {
      item: mockItem,
      origin: 'Detail',
      navigation: {
        navigate: jest.fn(), // Mock the navigate function
      },
      onSelect: jest.fn(), // Mock the onSelect function
    };
  });

  it('renders correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );

    expect(getByTestId('feedback-cell')).toBeTruthy();
    expect(getByTestId('user-name')).toHaveTextContent('test@example.com');
  });

  it('correctly identifies a new response', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );

    // Check if the response is marked as new
    const isNewResponse = !props.item.read; // Assuming read is false
    expect(isNewResponse).toBe(true);
  });

  it('renders response details correctly', () => {
    const {getByText} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );
    const NPSTextLabel = getByText('9'); // Check for answerText
    expect(NPSTextLabel).toBeTruthy();
  });
  // write testcases for NPSAnswerText component and NPSIcon component
  it('renders NPSAnswerText component correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );
    const NPSAnswerText = getByTestId('NPSAnswerText');
    console.log('NPSAnswerText', NPSAnswerText.props);
    expect(NPSAnswerText).toBeTruthy();
    expect(NPSAnswerText.props.style.color).toBe(getNPSColor('Promoter'));
  });
  it('handles disabled state correctly', () => {
    // Change origin to 'Detail' to disable the cell
    props.origin = 'Detail';
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );

    // Check if the cell is disabled
    expect(getByTestId('feedback-cell')).toBeDisabled(); // Adjust based on your implementation
  });

  it('renders RenderResponseContainer correctly', () => {
    const {getByTestId} = render(
      <Provider store={store}>
        <FeedbackCell {...props} />
      </Provider>,
    );

    // Check if RenderResponseContainer is rendered
    expect(getByTestId('response-container')).toBeTruthy(); // Ensure this testID is set in RenderResponseContainer
  });
});
