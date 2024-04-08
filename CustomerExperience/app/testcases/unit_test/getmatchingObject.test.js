const {default: ArrayUtils} = require('../../Utils/ArrayUtils');

describe('getMatchingObject function', () => {
  const testArray = [
    {id: 1, name: 'Alice'},
    {id: 2, name: 'Bob'},
    {id: 3, name: 'Charlie'},
  ];

  it('should return null when array is null', () => {
    expect(ArrayUtils.getMatchingObject(null, 'id', 1)).toBe(null);
  });

  it('should return null when array is empty', () => {
    expect(ArrayUtils.getMatchingObject([], 'id', 1)).toBe(null);
  });

  it('should return null when no matching object is found', () => {
    expect(ArrayUtils.getMatchingObject(testArray, 'id', 4)).toBe(null);
  });

  it('should return the matching object when found by id', () => {
    expect(ArrayUtils.getMatchingObject(testArray, 'id', 2)).toEqual({
      id: 2,
      name: 'Bob',
    });
  });

  it('should return the matching object when found by name', () => {
    expect(ArrayUtils.getMatchingObject(testArray, 'name', 'Charlie')).toEqual({
      id: 3,
      name: 'Charlie',
    });
  });

  it('should return the first matching object when multiple matching objects exist', () => {
    const duplicateArray = [
      {id: 1, name: 'Alice'},
      {id: 2, name: 'Bob'},
      {id: 3, name: 'Charlie'},
      {id: 4, name: 'Alice'},
    ];
    expect(
      ArrayUtils.getMatchingObject(duplicateArray, 'name', 'Alice'),
    ).toEqual({
      id: 1,
      name: 'Alice',
    });
  });
});
