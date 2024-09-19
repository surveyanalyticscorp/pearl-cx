import React from 'react';
import {render} from '@testing-library/react-native';
import NoDataFound from './NoDataFound';

describe('NoDataFound Component', () => {
  it('renders correctly', () => {
    const {getByText} = render(<NoDataFound dataText={'Data'} />);

    expect(getByText('No data found')).toBeTruthy();
  });
});
