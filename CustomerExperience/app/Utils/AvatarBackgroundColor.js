const colors = [
  '#F08080',
  '#87B89F',
  '#F7A5C5',
  '#D3A4FF',
  '#84B1A1',
  '#D08666',
  '#9D85BD',
  '#BB7D98',
  '#5AACCF',
  '#5E85B8',
  '#E2A74F',
  '#31936C',
  '#C785F3',
  '#33AFFF',
  '#DA974F',
  '#C66295',
  '#EBD13F',
  '#43B643',
  '#6179E6',
  '#7DD5A3',
];

export const getAvatarColor = name => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};
