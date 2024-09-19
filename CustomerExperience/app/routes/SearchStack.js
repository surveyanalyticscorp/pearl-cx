import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import {translate} from '../Utils/MultilinguaUtils';
import SearchFeedback from '../components/feedback/SearchFeedback';
import HeaderBackLeft from './commonUI/HeaderBackLeft';
import MenuIcon from './commonUI/MenuIcon';

const SearchNavStack = createStackNavigator();

const SearchStack = ({navigation}) => {
  return (
    <SearchNavStack.Navigator>
      <SearchNavStack.Screen
        name="Search Response"
        component={SearchFeedback}
        options={({navigation, route}) => ({
          headerShown: true,
          //   headerLeft: (props) => <HeaderBackLeft {...props} route={route} />,
          headerLeft: props => <MenuIcon />,
        })}
      />
    </SearchNavStack.Navigator>
  );
};

export default SearchStack;
