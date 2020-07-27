import React, {useEffect} from 'react';
import {View, Text} from 'react-native';
import {getDashboardContent, showLoading} from '../../../actions';
import {connect} from 'react-redux';
const DetractorTickets = props => {
  useEffect(() => {
    console.log(props.route.params.data);
  }, [props.route.params.data]);

  const getAPIDetractorTicketsData = () => {};

  return (
    <View style={{flex: 1}}>
      <Text>DetractorTickets</Text>
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
  getDashboardContent: token => {
  },
});

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(DetractorTickets);
