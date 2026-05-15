import React from 'react';
import {render} from '@testing-library/react-native';
import RenderAILogo from './RenderAILogo';

jest.mock('../../../routes/commonUI/StartAlignedView', () => ({children}) => children);

describe('RenderAILogo', () => {
  it('renders without crashing', () => {
    const {toJSON} = render(<RenderAILogo />);
    expect(toJSON()).toBeTruthy();
  });
});
