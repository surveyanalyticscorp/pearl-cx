import ArrayUtils from './ArrayUtils';

describe('ArrayUtils', () => {
  describe('getMatchingObject', () => {
    it('should return the matching object based on the property and expected value', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.getMatchingObject(array, 'id', 2);
      expect(result).toEqual({id: 2});
    });

    it('should return null if no matching object is found', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.getMatchingObject(array, 'id', 4);
      expect(result).toBeNull();
    });

    it('should return null if array is undefined', () => {
      const result = ArrayUtils.getMatchingObject(undefined, 'id', 2);
      expect(result).toBeNull();
    });
  });

  describe('isNotEmpty', () => {
    it('should return true for a non-empty array', () => {
      const array = [1, 2, 3];
      const result = ArrayUtils.isNotEmpty(array);
      expect(result).toBe(true);
    });

    it('should return false for an empty array', () => {
      const array = [];
      const result = ArrayUtils.isNotEmpty(array);
      expect(result).toBe(false);
    });

    it('should return false for a null or undefined array', () => {
      const result = ArrayUtils.isNotEmpty(null);
      expect(result).toBe(false);
    });
  });

  describe('isEmpty', () => {
    it('should return true for an empty array', () => {
      const array = [];
      const result = ArrayUtils.isEmpty(array);
      expect(result).toBe(true);
    });

    it('should return false for a non-empty array', () => {
      const array = [1, 2, 3];
      const result = ArrayUtils.isEmpty(array);
      expect(result).toBe(false);
    });

    it('should return true for a null or undefined array', () => {
      const result = ArrayUtils.isEmpty(undefined);
      expect(result).toBe(true);
    });
  });

  describe('containsElement', () => {
    it('should return true if the array contains the element', () => {
      const array = [1, 2, 3];
      const result = ArrayUtils.containsElement(array, 2);
      expect(result).toBe(true);
    });

    it('should return false if the array does not contain the element', () => {
      const array = [1, 2, 3];
      const result = ArrayUtils.containsElement(array, 4);
      expect(result).toBe(false);
    });
  });

  describe('getArrayOfFieldsFromArray', () => {
    it('should return an array of specified field values', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.getArrayOfFieldsFromArray(array, 'id');
      expect(result).toEqual([1, 2, 3]);
    });

    it('should return an empty array if input array is undefined', () => {
      const result = ArrayUtils.getArrayOfFieldsFromArray(undefined, 'id');
      expect(result).toEqual([]);
    });
  });

  describe('getMatchingObjectIndex', () => {
    it('should return the index of the matching object', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.getMatchingObjectIndex(array, 'id', 2);
      expect(result).toBe(1);
    });

    it('should return -1 if no matching object is found', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.getMatchingObjectIndex(array, 'id', 4);
      expect(result).toBe(-1);
    });

    it('should return -1 if array is undefined', () => {
      const result = ArrayUtils.getMatchingObjectIndex(undefined, 'id', 2);
      expect(result).toBe(-1);
    });
  });

  describe('removeAndGetMatchingObject', () => {
    it('should remove and return the matching object', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.removeAndGetMatchingObject(array, 'id', 2);
      expect(result).toEqual([{id: 2}]);
      expect(array).toEqual([{id: 1}, {id: 3}]);
    });

    it('should return null if no matching object is found', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.removeAndGetMatchingObject(array, 'id', 4);
      expect(result).toBeNull();
    });

    it('should return null if array is undefined', () => {
      const result = ArrayUtils.removeAndGetMatchingObject(undefined, 'id', 2);
      expect(result).toBeNull();
    });
  });

  describe('removeMatchingObjectAndReturnNewArray', () => {
    it('should remove the matching object and return the modified array', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.removeMatchingObjectAndReturnNewArray(
        array,
        'id',
        2,
      );
      expect(result).toEqual([{id: 1}, {id: 3}]);
    });

    it('should return the original array if no matching object is found', () => {
      const array = [{id: 1}, {id: 2}, {id: 3}];
      const result = ArrayUtils.removeMatchingObjectAndReturnNewArray(
        array,
        'id',
        4,
      );
      expect(result).toEqual(array);
    });

    it('should return an empty array if input array is undefined', () => {
      const result = ArrayUtils.removeMatchingObjectAndReturnNewArray(
        undefined,
        'id',
        2,
      );
      expect(result).toBeUndefined();
    });
  });

  describe('mereArraysFromObjectValues', () => {
    it('should merge arrays from object values', () => {
      const object = {
        key1: [1, 2, 3],
        key2: [4, 5, 6],
      };
      const result = ArrayUtils.mereArraysFromObjectValues(object);
      expect(result).toEqual([1, 2, 3, 4, 5, 6]);
    });

    it('should return an empty array if the object is empty', () => {
      const object = {};
      const result = ArrayUtils.mereArraysFromObjectValues(object);
      expect(result).toEqual([]);
    });
  });
});
