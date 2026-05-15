import {
  getSelectedTagList,
  getRemappedRootCauseTagList,
  isTagChecked,
  getTagCount,
  getTagCountFromSelectedList,
  addTags,
  removeTags,
} from './utils';

const rootCauseTags = [
  {
    name: 'Category A',
    rcTags: [
      {
        id: 1,
        name: 'Tag 1',
        isCustomerResponse: true,
        rcSubTags: [
          {id: 10, name: 'Sub 1', isCustomerResponse: false},
          {id: 11, name: 'Sub 2', isCustomerResponse: false},
        ],
      },
      {id: 2, name: 'Tag 2', rcSubTags: []},
    ],
  },
  {
    name: 'Category B',
    rcTags: [{id: 3, name: 'Tag 3', rcSubTags: []}],
  },
];

describe('utils', () => {
  describe('getSelectedTagList', () => {
    it('returns empty array when nothing selected', () => {
      const result = getSelectedTagList(rootCauseTags, []);
      expect(result).toEqual([]);
    });

    it('returns tag group when a tag is selected', () => {
      const selected = [{id: 1, isTag: true}];
      const result = getSelectedTagList(rootCauseTags, selected);
      expect(result).toHaveLength(1);
      expect(result[0].title).toBe('Category A');
      expect(result[0].items[0].id).toBe(1);
    });

    it('returns subtag group with parent > child title', () => {
      const selected = [{id: 10, isTag: false}];
      const result = getSelectedTagList(rootCauseTags, selected);
      expect(result[0].title).toBe('Category A > Tag 1');
      expect(result[0].items[0].id).toBe(10);
    });

    it('groups multiple selections under same category', () => {
      const selected = [
        {id: 1, isTag: true},
        {id: 2, isTag: true},
      ];
      const result = getSelectedTagList(rootCauseTags, selected);
      expect(result[0].items).toHaveLength(2);
    });
  });

  describe('getRemappedRootCauseTagList', () => {
    it('marks matching tags as checked', () => {
      const selected = [{id: 1}, {id: 10}];
      const result = getRemappedRootCauseTagList(rootCauseTags, selected);
      expect(result[0].rcTags[0].isChecked).toBe(true);
      expect(result[0].rcTags[0].rcSubTags[0].isChecked).toBe(true);
    });

    it('leaves unmatched tags unchecked', () => {
      const result = getRemappedRootCauseTagList(rootCauseTags, []);
      expect(result[0].rcTags[0].isChecked).toBe(false);
    });
  });

  describe('isTagChecked', () => {
    it('returns false when selected list is empty', () => {
      expect(isTagChecked([], 1)).toBe(false);
    });

    it('returns true when id is in selected list', () => {
      expect(isTagChecked([{id: 1}, {id: 2}], 1)).toBe(true);
    });

    it('returns false when id is not in selected list', () => {
      expect(isTagChecked([{id: 1}, {id: 2}], 3)).toBe(false);
    });
  });

  describe('getTagCount', () => {
    it('counts checked tags and subtags', () => {
      const item = {
        rcTags: [
          {isChecked: true, rcSubTags: [{isChecked: true}, {isChecked: false}]},
          {isChecked: false, rcSubTags: []},
        ],
      };
      expect(getTagCount(item)).toBe(2);
    });

    it('returns 0 when nothing checked', () => {
      const item = {rcTags: [{isChecked: false, rcSubTags: [{isChecked: false}]}]};
      expect(getTagCount(item)).toBe(0);
    });
  });

  describe('getTagCountFromSelectedList', () => {
    it('counts tags matching selectedRootCauses by id', () => {
      const selected = [{id: 1}, {id: 10}];
      const item = {
        rcTags: [
          {id: 1, rcSubTags: [{id: 10}, {id: 11}]},
          {id: 2, rcSubTags: []},
        ],
      };
      expect(getTagCountFromSelectedList(selected, item)).toBe(2);
    });
  });

  describe('addTags', () => {
    it('adds new tags to empty list', () => {
      const result = addTags([], [{id: 1, name: 'a'}]);
      expect(result).toHaveLength(1);
    });

    it('merges tags by id (no duplicates)', () => {
      const result = addTags([{id: 1, name: 'a'}], [{id: 1, name: 'a'}, {id: 2, name: 'b'}]);
      expect(result).toHaveLength(2);
    });

    it('returns unchanged list when tagList is empty', () => {
      const existing = [{id: 1}];
      expect(addTags(existing, [])).toBe(existing);
    });
  });

  describe('removeTags', () => {
    it('removes tags by id', () => {
      const result = removeTags([{id: 1}, {id: 2}], [{id: 1}]);
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe(2);
    });

    it('returns unchanged list when tagList is empty', () => {
      const existing = [{id: 1}];
      expect(removeTags(existing, [])).toBe(existing);
    });

    it('returns unchanged list if id not found', () => {
      const result = removeTags([{id: 1}], [{id: 99}]);
      expect(result).toHaveLength(1);
    });
  });
});
