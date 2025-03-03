import React from 'react';
import {render} from '@testing-library/react-native';
import NoResponsesFound from './NoResponsesFound';

describe('NoResponsesFound Component', () => {
  it('renders correctly without crashing', () => {
    const {getByTestId} = render(
      <NoResponsesFound text="No responses available" />,
    );
    expect(getByTestId('no-responses-found-view')).toBeTruthy();
  });

  it('displays the correct text passed as a prop', () => {
    const testText = 'No responses available';
    const {getByText} = render(<NoResponsesFound text={testText} />);
    expect(getByText(testText)).toBeTruthy();
  });

  it('renders the TextLabel component', () => {
    const {getByTestId} = render(
      <NoResponsesFound text="No responses available" />,
    );
    expect(getByTestId('text-label')).toBeTruthy();
  });
});
