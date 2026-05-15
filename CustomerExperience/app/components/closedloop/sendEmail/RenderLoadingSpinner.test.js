import React from 'react';
import {render} from '@testing-library/react-native';
import RenderLoadingSpinner from './RenderLoadingSpinner';

jest.mock('../../../widgets/QPLoader', () => () => null);

describe('RenderLoadingSpinner', () => {
  it('renders spinner when isLoading is true', () => {
    const {toJSON} = render(<RenderLoadingSpinner isLoading={true} />);
    expect(toJSON()).toBeTruthy();
  });

  it('returns null when isLoading is false', () => {
    const {toJSON} = render(<RenderLoadingSpinner isLoading={false} />);
    expect(toJSON()).toBeNull();
  });

  it('returns null when isLoading is undefined', () => {
    const {toJSON} = render(<RenderLoadingSpinner />);
    expect(toJSON()).toBeNull();
  });
});
