import {QPBottomSheet, QPBottomSheetHeader} from './index';
import _QPBottomSheet from './QPBottomSheet';
import _QPBottomSheetHeader from './QPBottomSheetHeader';

describe('QPBottomSheet barrel export', () => {
  it('exports QPBottomSheet as a non-null value', () => {
    expect(QPBottomSheet).toBeDefined();
    expect(QPBottomSheet).not.toBeNull();
  });

  it('exports QPBottomSheetHeader as a non-null value', () => {
    expect(QPBottomSheetHeader).toBeDefined();
    expect(QPBottomSheetHeader).not.toBeNull();
  });

  it('QPBottomSheet barrel export matches the direct import', () => {
    expect(QPBottomSheet).toBe(_QPBottomSheet);
  });

  it('QPBottomSheetHeader barrel export matches the direct import', () => {
    expect(QPBottomSheetHeader).toBe(_QPBottomSheetHeader);
  });
});
