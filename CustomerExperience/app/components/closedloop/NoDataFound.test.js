import React from 'react';
import {render} from '@testing-library/react-native';
import NoDataFound from './NoDataFound';

describe('NoDataFound Component', () => {
  it('renders correctly', () => {
    const component = render(<NoDataFound />);
    expect(component).toBeTruthy();
  });

  it('renders correctly with dataText', () => {
    const {getByText} = render(<NoDataFound dataText={'Data'} />);

    expect(getByText('No data found')).toBeTruthy();
  });
});
