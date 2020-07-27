/* eslint-disable */
import React, {useEffect, useState} from 'react';
import {View, Text, Dimensions} from 'react-native';
import {connect} from 'react-redux';
import {DotIndicator} from 'react-native-indicators';
import {Colors} from '../../../styles/color.constants';
import {TabBar, TabView} from 'react-native-tab-view';
import {getDetractorContent} from '../../../actions';
import {fontFamily} from '../../../styles/font.constants';
import {TextSizes} from '../../../styles/textsize.constants';
import {MarginConstants} from '../../../styles/margin.constants';

const DetractorTickets = props => {
  const [index, setIndex] = useState(0);
  const [routes] = React.useState([
    {key: 'new', title: 'NEW'},
    {key: 'pending', title: 'PENDING'},
    {key: 'resolved', title: 'RESOLVED'},
  ]);
  useEffect(() => {
    let param = {
      pageOffset: '0',
      status: '0',
      storeId: props.route.params.data.storeId,
    };
    props.getDetractorContents(param, props.route.params.data.token);
  }, []);

  const renderIndicator = () => {
    if (props.isLoading) {
      return <DotIndicator color={Colors.white} count={3} size={10} />;
    }
  };

  const renderScene = ({route}) => {
    switch (route.key) {
      case 'feedback':
        return <View style={{backgroundColor: 'red'}} />;
      case 'profile':
        return <View style={{backgroundColor: 'blue'}} />;
      case 'activity':
        return <View style={{backgroundColor: 'green'}} />;
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
            style={{backgroundColor: 'white'}}
            scrollEnabled={true}
            indicatorStyle={{backgroundColor: Colors.red}}
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
    <View style={{flex: 1}}>
      {renderTabView()}
      {renderIndicator()}
    </View>
  );
};

const mapStateToProps = state => {
  return {
    userInfo: state.global.userInfo,
    isLoading: state.global.isLoading,
    isError: state.global.isError,
    errorMessage: state.global.errorMessage,
  };
};

const mapDispatchToProps = dispatch => ({
  getDetractorContents: (param, token) => {
    getDetractorContent(param, token);
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetractorTickets);
