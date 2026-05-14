import {getAvatarColor} from './AvatarBackgroundColor';

describe('getAvatarColor', () => {
  it('should return a hex color string for a given name', () => {
    const color = getAvatarColor('Alice');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should return the same color for the same name (deterministic)', () => {
    expect(getAvatarColor('Bob')).toBe(getAvatarColor('Bob'));
  });

  it('should return different colors for different names', () => {
    const colors = ['Alice', 'Bob', 'Charlie', 'Dave'].map(getAvatarColor);
    const unique = new Set(colors);
    expect(unique.size).toBeGreaterThan(1);
  });

  it('should handle a single character name', () => {
    const color = getAvatarColor('A');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should handle a long name', () => {
    const color = getAvatarColor('VeryLongNameWithManyCharacters');
    expect(color).toMatch(/^#[0-9A-Fa-f]{6}$/);
  });

  it('should return a color from the predefined palette (length mod 20)', () => {
    const name = 'Test';
    const color = getAvatarColor(name);
    const validColors = [
      '#F08080', '#87B89F', '#F7A5C5', '#D3A4FF', '#84B1A1',
      '#D08666', '#9D85BD', '#BB7D98', '#5AACCF', '#5E85B8',
      '#E2A74F', '#31936C', '#C785F3', '#33AFFF', '#DA974F',
      '#C66295', '#EBD13F', '#43B643', '#6179E6', '#7DD5A3',
    ];
    expect(validColors).toContain(color);
  });
});
