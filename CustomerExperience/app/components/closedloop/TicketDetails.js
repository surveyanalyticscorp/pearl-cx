import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs';
import React, {useEffect} from 'react';
import {BackHandler, useWindowDimensions} from 'react-native';
import {Colors} from '../../styles/color.constants';

import {PaddingConstants} from '../../styles/padding.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {RenderSpinner} from '../../routes/CommonScreen';
import {translate} from '../../Utils/MultilinguaUtils';
import TicketOverview from './TicketOverview';
import TicketComments from './TicketComments';
import TicketActivity from './TicketActivity';
import {FontFamily} from '../../styles/font.constants';
import {useDispatch, useSelector} from 'react-redux';
import {getClosedLoopTicketItem} from '../../redux/actions/dashboard.actions';

export default function TicketDetails(props) {
  const {authToken, isTicketLoading} = useSelector((state) => state.global);
  const {feedbackApiKey} = useSelector((state) => state.global.userInfo);
  const ticketItem = props.route.params;
  const dispatch = useDispatch();

  // console.log('Ticket ID', ticketItem);
  const TicketTabs = createMaterialTopTabNavigator();

  useEffect(() => {
    props.navigation.setOptions({
      title: `Ticket #${ticketItem.id}`,
    });
  }, [props.navigation]);

  useEffect(() => {
    dispatch(getClosedLoopTicketItem(authToken, ticketItem.id, feedbackApiKey));
  }, [ticketItem, authToken]);

  const CLFTicketTabStack = () => {
    return (
      <TicketTabs.Navigator
        tabBarOptions={{
          labelStyle: {
            width: useWindowDimensions().width / 4,
            fontSize: TextSizes.secondary,
            fontFamily: FontFamily.secondary,
          },
          indicatorStyle: {backgroundColor: Colors.accentLight},
          style: {backgroundColor: Colors.white, width: '100%'},
          initialLayout: {width: useWindowDimensions().width},
          tabStyle: {height: 1.2 * PaddingConstants.tab4},
          activeTintColor: Colors.accentLight,
          inactiveTintColor: Colors.primary,
        }}
        lazy
        keyboardDismissMode={'auto'}>
        <TicketTabs.Screen
          name={translate('close_loop.overview')}
          component={TicketOverview}
          initialParams={{screenName: 'Overview'}}
        />
        <TicketTabs.Screen
          name={translate('close_loop.comments')}
          component={TicketComments}
          initialParams={{screenName: 'Comments'}}
        />
        <TicketTabs.Screen
          name={translate('responses.activity')}
          component={TicketActivity}
          initialParams={{screenName: 'Activity'}}
        />
      </TicketTabs.Navigator>
    );
  };

  return isTicketLoading ? <RenderSpinner /> : <CLFTicketTabStack />;
}
