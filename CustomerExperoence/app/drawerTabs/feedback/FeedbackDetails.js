import React, {useState} from 'react';
import {Text, View, Image, TouchableHighlight, Dimensions} from 'react-native';

import FeedbackCell from '../../screens/rows/FeedbackCells';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {TabBar, TabView} from 'react-native-tab-view';
import {Colors} from '../../styles/color.constants';
import {fontFamily} from '../../styles/font.constants';
import {TextSizes} from '../../styles/textsize.constants';
import {MarginConstants} from '../../styles/margin.constants';
import QPWebView from '../../widgets/QPWebView';
import ActionButton from 'react-native-action-button';
import {StackActions} from '@react-navigation/native';
const FeedbackDetail = props => {
  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    {key: 'feedback', title: 'Feedback'},
    {key: 'profile', title: 'Profile'},
    {key: 'activity', title: 'Activity'},
  ]);

  const onActionButtonPress = () => {
    const pushAction = StackActions.push('Change Status', {
      data: props.route.params.data,
      ticketStatus: props.route.params.ticketStatus,
      token: props.route.params.authToken,
    });
    props.navigation.dispatch(pushAction);
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'feedback':
        return (
          <QPWebView
            authToken={props.route.params.token}
            uri={props.route.params.data.responseDataURL}
          />
        );
      case 'profile':
        return (
          <QPWebView
            authToken={props.route.params.token}
            uri={props.route.params.data.memberProfileURL}
          />
        );
      case 'activity':
        return (
          <QPWebView
            authToken={props.route.params.token}
            uri={props.route.params.data.activityURL}
          />
        );
    }
  };

  const renderTabView = () => {
    return (
      <TabView
        navigationState={{index, routes}}
        renderScene={renderScene}
        onIndexChange={setIndex}
        //initialLayout={initialLayout}
        renderTabBar={props => (
          <TabBar
            {...props}
            labelStyle={{
              indicatorStyle: {backgroundColor: '#FF0000'},
              scrollEnabled: true,
              labelStyle: {color: '#000000', fontSize: 12},
              tabStyle: {width: 150},
            }}
            indicatorStyle={{backgroundColor: 'rgb(29, 119, 186)'}}
            style={{backgroundColor: 'white'}}
            scrollEnabled={true}
            tabStyle={{
              minHeight: 30,
              width: Dimensions.get('window').width / 3,
            }} // here
            renderLabel={({route, focused, color}) => (
              <Text
                style={{
                  color: Colors.primary,
                  fontFamily: fontFamily.Light,
                  fontSize: TextSizes.secondary,
                  marginVertical: MarginConstants.halfTab,
                }}>
                {route.title}
              </Text>
            )}
          />
        )}
      />
    );
  };
  return (
    <View style={{flex: 1, paddingTop: 5}}>
      <FeedbackCell
        item={props.route.params.data}
        origin="Detail"
        ticketStatuses={props.route.params.ticketStatus}
      />
      {renderTabView()}
      <ActionButton
        elevation={8}
        buttonColor="rgba(28,118,185,1)"
        onPress={onActionButtonPress}
        icon={<Icon size={30} name="comment" color={'white'} />}
      />
    </View>
  );
};

export default FeedbackDetail;
