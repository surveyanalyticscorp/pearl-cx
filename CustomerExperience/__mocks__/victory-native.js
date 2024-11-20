// __mocks__/victory-native.js
// create mock for victory-native victorypie

export const VictoryPie = jest.fn(() => (
  <mock-VictoryPie testID="victory-pie" />
));

export default {
  VictoryPie: VictoryPie,
};
