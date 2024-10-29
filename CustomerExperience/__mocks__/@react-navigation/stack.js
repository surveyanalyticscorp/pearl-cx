// // __mocks__/@react-navigation/stack.js
// jest.mock('@react-navigation/stack', () => {
//   return {
//     createStackNavigator: jest.fn().mockReturnValue({
//       Navigator: ({children}) => <>{children}</>,
//       Screen: ({children}) => <>{children}</>,
//     }),
//   };
// });

// __mocks__/@react-navigation/stack.js
const mockNavigator = {
  Navigator: ({children}) => children,
  Screen: ({children}) => children,
};

export const createStackNavigator = jest.fn(() => mockNavigator);
