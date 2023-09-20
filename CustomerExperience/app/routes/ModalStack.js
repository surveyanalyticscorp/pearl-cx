import React from 'react';
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack';
import CreateTicket from '../components/dashboard/ticketManagement/CreateTicket';
import {translate} from '../Utils/MultilinguaUtils';

const ModalStack = createStackNavigator();

export function ModalStackScreen() {
  return (
    <ModalStack.Navigator mode="modal">
      <ModalStack.Screen
        name={translate('responses.new_ticket')}
        component={CreateTicket}
        screenOptions={() => ({
          gestureEnabled: true,
          ...TransitionPresets.ModalPresentationIOS,
        })}
        options={({navigation, route}) => ({
          headerShown: false,
          // headerLeft: (props) => <View />,
          // headerRight: (props) => <CloseButton />,
        })}
      />
    </ModalStack.Navigator>
  );
}
