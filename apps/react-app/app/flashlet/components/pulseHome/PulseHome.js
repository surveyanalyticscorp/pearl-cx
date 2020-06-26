/*jshint esversion:6*/

import React, { Component } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Navigator,
  ScrollView,
  NativeEventEmitter,
  NativeModules,
  DeviceEventEmitter,
  AsyncStorage
} from 'react-native';
import {
  ActionBarModule
} from '../../../global/native-modules/NativeModules';
import BaseComponent from '../../../global/components/BaseComponent';
import { apiHandler } from '../../../global/api/APIHandler';
import { Actions } from 'react-native-router-flux';
import Pulse from './Pulse';
import CommentBox from './CommentBox';
import PulseDashboard from './PulseDashboard';
import CustomText from '../../../global/ui/CustomText';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux'
import { ActionCreators } from '../../actions'
const { ContextMenuManager } = NativeModules;
class Home extends BaseComponent {
  constructor(props) {
    super(props);

    this.eventEmitter = new NativeEventEmitter(ContextMenuManager);
  }


  componentDidMount() {
    this.props.navigationStateHandler.registerFocusHook(this);
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Pulse' }));

    if (global.fromLogin) {
      this.checkAndLaunchSupervisorModal();
      global.fromLogin = false;
    }
    this.requestData = {};

    if (this.props.questionData.body && this.props.questionData.body.selectedBatch.batch) {
      this.dataJSON = JSON.stringify(this.props.questionData);
      this.requestData = { campaignBatchID: this.props.questionData.body.selectedBatch.batch.ID };

    }
    this.reloadContent();
  }
  checkAndLaunchSupervisorModal() {

    if ((global.appUser.parentMemberID === 0 || global.appUser.parentMemberID === -1)) {
      Actions.supervisorModal();

    }

  }

  componentDidUpdate(prevState, prevProps) {
    if (this.props.questionData) {
      let dataJSON = this.props.questionData;
      if(!dataJSON.hasOwnProperty('title')) {
        dataJSON.title = 'Pulse';
      }
      ActionBarModule.updateTitleAndMenu(JSON.stringify(dataJSON));
    }
  }


  reloadContent() {
    this.getPulse(this.requestData);
  }
  getPulse(requestData) {
    // if (!this.props.isLoading && this.props.isConnected)
      this.props.getPulseData(requestData).then(() => {
        if (this.props.error) {
          this.showErrorToastAndClear();
        }
        else {
          this.dataJSON = JSON.stringify(this.props.questionData);
          this.requestData = { campaignBatchID: this.props.questionData.body.selectedBatch.batch.ID };
        }
      });

  }

  componentWillUnmount() {
    super.componentWillUnmount();
    this.props.navigationStateHandler.unregisterFocusHook(this);
  }

  handleNavigationSceneFocus() {
    ActionBarModule.toggleBackButton(false);
  }
  componentWillReceiveProps(newProps) {
    ActionBarModule.toggleBackButton(false);
    if (newProps.campaignBatchID && this.props.campaignBatchID != newProps.campaignBatchID) {
      this.requestData = { campaignBatchID: newProps.campaignBatchID };
      this.reloadContent();
    }
  }
  componentWillMount() {
    super.componentWillMount();


    this.contextClickListner = this.eventEmitter.addListener('ContextMenuItemClick', (requestObject) => {
      let request = JSON.parse(requestObject.DATA);
      if (this.requestData.campaignBatchID !== request.campaignBatchID) {
        this.requestData = request;
        this.reloadContent();
        this.scrollToStart();
      }
    });
    //Hack to reload when screen appears in front.
    this.reloadListner = this.eventEmitter.addListener('reloadScreen', (isReload) => {
      this.requestData = {};
      this.reloadContent();
    });
  }

  renderChild() {
    if (this.props.questionData && JSON.stringify(this.props.questionData) != '{}') {
      return (
        <View style={{ flex: 1 }}>
          {this.getContentToDisplay()}
        </View>
      );
    }
    return (<View style={{ flex: 1 }}></View>);
  }

  getContentToDisplay() {

    if (this.props.questionData.body.selectedBatch.hasResult) {
      return (<PulseDashboard data={this.props.questionData}>
      </PulseDashboard>);
    }
    if (this.props.questionData.body.selectedBatch.question) {
      return (<Pulse data={this.props.questionData}
        onAnswerSelect={(data) => {
          this.onPulseAnswerSelect(data);
        }}>
      </Pulse>);
    }
    return (
      <View style={styles.mainContainer}>
        <CustomText style={styles.noDataStyle}>No Pulse setup for you.</CustomText>
      </View>);

  }

  onPulseAnswerSelect(data) {
    Actions.commentBox({ data: data });
    global.titleAndMenuStack.push(this.dataJSON);
    ActionBarModule.toggleBackButton(true);
    this.updateContextMenuAndTitle(JSON.stringify({ "title": this.props.questionData.title }));
  }
}



const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column'
  },
  mainContainer: {
    backgroundColor: '#ffffff',
    marginTop: 8,
    marginBottom: 8,
    marginLeft: 15,
    marginRight: 15
  },
  noDataStyle: {
    margin: 15,
    color: '#7e7e7e',
  },

});
function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    questionData: state.pulseData,
    isLoading: state.isLoading,
    error: state.error.message,
    isConnected: state.network.isConnected
  };
}


export default connect(mapStateToProps, mapDispatchToProps)(Home);
