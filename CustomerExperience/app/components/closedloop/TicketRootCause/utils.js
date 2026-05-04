export function getSelectedTagList(rootCauseTags, selectedRootCauseTags) {
  const assignedMap = new Map();
  selectedRootCauseTags.forEach(item => {
    assignedMap.set(item.id, item.isTag);
  });

  const resultMap = new Map();

  rootCauseTags.forEach(category => {
    const categoryName = category.name;

    category.rcTags.forEach(tag => {
      const tagName = tag.name;

      // Check if tag is assigned
      if (assignedMap.has(tag.id) && assignedMap.get(tag.id) === true) {
        const title = `${categoryName}`;
        if (!resultMap.has(title)) resultMap.set(title, []);
        resultMap.get(title).push({
          id: tag.id,
          name: tag.name,
          isTag: true,
          isCustomerResponse: tag.isCustomerResponse ?? false,
        });
      }

      // Check each subtag
      (tag.rcSubTags || []).forEach(subTag => {
        if (
          assignedMap.has(subTag.id) &&
          assignedMap.get(subTag.id) === false
        ) {
          const title = `${categoryName} > ${tagName}`;
          if (!resultMap.has(title)) resultMap.set(title, []);
          resultMap.get(title).push({
            id: subTag.id,
            name: subTag.name,
            isTag: false,
            isCustomerResponse: subTag.isCustomerResponse ?? false,
          });
        }
      });
    });
  });

  // Convert resultMap to desired array format
  const finalResult = [];
  for (const [title, items] of resultMap.entries()) {
    finalResult.push({title, items});
  }

  return finalResult;
}

export const getRemappedRootCauseTagList = (
  rootCauseTags,
  selectedRootCauses,
) => {
  const assignedIds = new Set(selectedRootCauses.map(item => item.id));

  const updatedAllRC = rootCauseTags.map(rc => {
    const updatedTags = rc.rcTags.map(tag => {
      const isTagChecked = assignedIds.has(tag.id);
      const updatedSubTags = (tag.rcSubTags || []).map(subTag => {
        return {
          ...subTag,
          isChecked: assignedIds.has(subTag.id),
          isCustomerResponse: subTag.isCustomerResponse ?? false,
        };
      });

      return {
        ...tag,
        isChecked: isTagChecked,
        rcSubTags: updatedSubTags,
        isCustomerResponse: tag.isCustomerResponse ?? false,
      };
    });

    return {
      ...rc,
      rcTags: updatedTags,
    };
  });

  return updatedAllRC;
};

export const isTagChecked = (selectedRootCauses, id) => {
  if (selectedRootCauses.length === 0) {
    return false;
  }
  for (let i = 0; i < selectedRootCauses.length; i++) {
    if (selectedRootCauses[i].id === id) {
      return true;
    }
  }

  return false;
};

export const getTagCount = item => {
  return item.rcTags.reduce((acc, current) => {
    let a = current.rcSubTags.reduce((acc_, current_) => {
      return acc_ + (current_.isChecked ? 1 : 0);
    }, 0);
    return acc + (current.isChecked ? 1 : 0) + a;
  }, 0);
};

export const getTagCountFromSelectedList = (selectedRootCauses, item) => {
  return item.rcTags.reduce((acc, current) => {
    let a = current.rcSubTags.reduce((acc_, current_) => {
      return acc_ + (isTagChecked(selectedRootCauses, current_.id) ? 1 : 0);
    }, 0);
    return acc + (isTagChecked(selectedRootCauses, current.id) ? 1 : 0) + a;
  }, 0);
};

export const addTags = (selectedRootCauses = [], tagList) => {
  if (tagList.length === 0) {
    return selectedRootCauses;
  }
  let selectedMap = new Map();
  if (selectedRootCauses.length > 0) {
    selectedRootCauses.forEach(item => {
      selectedMap.set(item.id, item);
    });
  }

  tagList.forEach(item => {
    selectedMap.set(item.id, item);
  });

  return Array.from(selectedMap.values());
};

export const removeTags = (selectedRootCauses = [], tagList) => {
  if (tagList.length === 0) {
    return selectedRootCauses;
  }
  let selectedMap = new Map();
  if (selectedRootCauses.length > 0) {
    selectedRootCauses.forEach(item => {
      selectedMap.set(item.id, item);
    });
  }

  tagList.forEach(item => {
    if (selectedMap.has(item.id)) {
      selectedMap.delete(item.id);
    }
  });

  return Array.from(selectedMap.values());
};
