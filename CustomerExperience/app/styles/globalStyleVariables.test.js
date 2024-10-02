import {$rem} from './globalStyleVariables';

describe('Global Style Variables', () => {
  it('should have correct rem value', () => {
    expect($rem).toBe(15);
  });
});
