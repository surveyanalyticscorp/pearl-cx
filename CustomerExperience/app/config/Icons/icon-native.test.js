jest.mock('react-native-vector-icons/lib/create-icon-set', () => () => 'MockIconSet');
jest.mock('../../../assets/fonts/icomoon.json', () => ({}), {virtual: true});

describe('icon-native', () => {
  it('exports a valid icon set', () => {
    const IconSet = require('./icon-native').default;
    expect(IconSet).toBeDefined();
  });
});
