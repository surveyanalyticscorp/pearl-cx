import {$rem} from './globalStyleVariables';

const factor = 0.5;

export const PaddingConstants = {
  quarterTab: (factor * $rem) / 4,
  halfTab: (factor * $rem) / 2,
  halfTab_3x: 3 * ((factor * $rem) / 2),
  halfTab_5x: 5 * ((factor * $rem) / 2),
  tab1: factor * $rem,
  tab1_2x: factor * $rem * 2,
  tab1_3x: factor * $rem * 3,
  tab1_4x: factor * $rem * 4,
  tab1_5x: factor * $rem * 5,
  tab1_6x: factor * $rem * 6,
  tab1_7x: factor * $rem * 7,
  tab1_8x: factor * $rem * 8,
  tab1_16x: factor * $rem * 16,
  tab1_24x: factor * $rem * 24,
  tab1_32x: factor * $rem * 32,
  tab2: factor * $rem + 10,
  tab3: factor * $rem + 20,
  tab4: factor * $rem + 30,
};
