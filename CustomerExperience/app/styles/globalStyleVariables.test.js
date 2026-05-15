import {$rem} from './globalStyleVariables';
import {Dimensions, PixelRatio} from 'react-native';

describe('Global Style Variables', () => {
  afterEach(() => {
    jest.resetModules();
    jest.restoreAllMocks();
  });

  it('exports $rem as a positive number', () => {
    expect(typeof $rem).toBe('number');
    expect($rem).toBeGreaterThan(0);
  });

  it('sets rem=18 for tablet with tempWidth===768', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({width: 768, height: 1024, scale: 1, fontScale: 1});
    jest.spyOn(PixelRatio, 'get').mockReturnValue(1);
    const {$rem: remVal} = require('./globalStyleVariables');
    expect(remVal).toBe(18);
  });

  it('sets rem=20 for large tablet with tempWidth>768', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({width: 1024, height: 1366, scale: 1, fontScale: 1});
    jest.spyOn(PixelRatio, 'get').mockReturnValue(1);
    const {$rem: remVal} = require('./globalStyleVariables');
    expect(remVal).toBe(20);
  });

  it('sets rem=26 for extra-wide screen (tempWidth>414)', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({width: 500, height: 900, scale: 1, fontScale: 1});
    jest.spyOn(PixelRatio, 'get').mockReturnValue(1);
    const {$rem: remVal} = require('./globalStyleVariables');
    expect(remVal).toBe(26);
  });

  it('sets rem=18 for wide phone (tempWidth>385)', () => {
    jest.spyOn(Dimensions, 'get').mockReturnValue({width: 400, height: 900, scale: 1, fontScale: 1});
    jest.spyOn(PixelRatio, 'get').mockReturnValue(1);
    const {$rem: remVal} = require('./globalStyleVariables');
    expect(remVal).toBe(18);
  });
});
