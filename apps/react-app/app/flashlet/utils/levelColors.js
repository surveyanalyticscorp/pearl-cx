/**
   * Returns a color according to level.
   *
   * @param {number} colorId
   * @returns {string}
   */
export const getColor = (colorId) => {
  switch (colorId) {
    case 1:
      return '#C43434';

    case 2:
      return '#F7B850';

    case 3:
      return '#7ED321';

    case 4:
      return '#658C36';

    default:
      return '#ACACAC';
  }
};
