
import React, { Component } from 'react';
import {
  StyleSheet,
  ToolbarAndroid,
  Text,
  View,
  ScrollView,
  ActivityIndicator
} from 'react-native';

import BaseComponent from '../../../global/components/BaseComponent';
import CommentWidget from '../../../global/widgets/smiley-question/CommentWidget';
import Home from './PulseHome';
import { apiHandler } from '../../../global/api/APIHandler';
import { Actions, ActionConst } from 'react-native-router-flux';
const dismissKeyboard = require('dismissKeyboard');
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
import {
  ActionBarModule
} from '../../../global/native-modules/NativeModules';
class CommentBox extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      text: '',
      showLoader: false,
      isConnected: null,
      dataLoaded: true,
      refreshEnabled: false,
    };
  }
  componentDidMount(){
    ActionBarModule.toggleBackButton(true);
  }

  renderChild() {

    return (
      <View style={{ flex: 1 }}>
        <CommentWidget
          title={'Comments'}
          onPress={() => {
            dismissKeyboard();
            this.handleNextPress();
          }}
          onCommentChange={(text1) => {
            this.setState({ text: text1 })
          }}
        >
        </CommentWidget>
      </View>
    );
  }

  handlePulseSubmitResponse(result) {
    console.log("handlePulseSubmitResponse" + JSON.stringify(result));
    if (result) {
      if (result.statusCode == 200 && !this.props.error) {
        let data = { "campaingnBatchID": this.props.data.campaingnBatchID };
        Actions.pop();

      }
    }
  }

  handleNextPress() {

    this.props.data.comment = this.state.text;
    console.log("handleNextPress" + JSON.stringify(this.props.data));


    this.props.submitPulseResponse(this.props.data).then(() => {
      this.handlePulseSubmitResponse(this.props.resultData);
    })

  }
}
const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    height: 200,
    alignSelf: 'stretch'
  },
  parentContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },

});
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    resultData: state.pulseData,
    isLoading: state.isLoading,
    error: state.error.message,
    isConnected: state.network.isConnected
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(CommentBox);
