/*jshint esversion: 6 */

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Navigator,
  TouchableHighlight,
  ToolbarAndroid,
  ScrollView,
  ListView,
  NetInfo,
  DeviceEventEmitter,
  NativeEventEmitter,
  NativeModules
} from 'react-native';

import {
  ActionBarModule
} from '../../global/native-modules/NativeModules';
import QPCard from '../../global/widgets/card/QPCard';
import BaseComponent from '../../global/components/BaseComponent';
import QPCardTitle from '../../global/widgets/card/QPCardTitle';
import Dashboard from '../dashboard/Dashboard';
import {apiHandler} from '../../global/api/APIHandler';
import MainContainer from '../../global/ui/MainContainer';
import SurveyItemWidget from '../../global/widgets/SurveyItemWidget';
import CustomText from '../../global/ui/CustomText';
var dataJSON = {};
export default class SurveyList extends BaseComponent {

  constructor() {
    super();
    this.state = { surveys: [], dataLoaded: false, requestData: {} , showLoader: false};
  }
  componentDidMount() {
    this.getSurveys();
  }

  componentDidUpdate(prevProps, prevState) {
    if (!this.state.dataLoaded && !this.state.error) {
      this.getSurveys();
    }
  }



  processAPIResponse(response) {
    dataJSON = JSON.stringify(response);
    this.setState({ data: response.body, dataLoaded: true, error: false, showLoader: false });
  }

  getSurveys() {
    console.log("getSurveys> " + this.state.isConnected);
    if (this.state.isConnected && !this.state.showLoader) {
      //update state to start loading
      this.prepareForNetworkRequest();
      apiHandler.getSurveys(this.processAPIResponse.bind(this), this.state.requestData, (error) => {
        this.handleError(error);
      });
    }
  }

  componentWillMount() {
    super.componentWillMount();
    console.log("componentWillMount> Child ");

    DeviceEventEmitter.addListener("ContextMenuItemClick",
      (folderDetails) => { this.onFolderChange(folderDetails) });

    const {ContextMenuManager} = NativeModules;
    this.eventEmitter = new NativeEventEmitter(NativeModules.ContextMenuManager);
    this.eventEmitter.addListener("ContextMenuItemClick",
      (folderDetails) => { this.onFolderChange(folderDetails) });
  }
  onFolderChange(folderDetails) {
    console.log(folderDetails.DATA);
    let folderData = JSON.parse(folderDetails.DATA);
    this.setState({ requestData: folderData,  dataLoaded : false});
    this.scrollToStart();
  }

  renderNoDataFound() {
    return <CustomText>{this.state.data.noSurveyFoundMessage}</CustomText>
  }

  renderSurveyList() {
    var dataSource = new ListView.DataSource({
      rowHasChanged: (r1, r2) => {
        r1 != r2
      }
    });
    let listDataSource = dataSource.cloneWithRows(this.state.data.surveys);
    return (
      <ListView ref="surveyList" dataSource={listDataSource}
        renderRow={this.renderRow.bind(this) }>
      </ListView>
    );

  }
  reloadContent() {
    this.getSurveys();
  }

  renderRow(survey) {
    return (
      <SurveyItemWidget title = {survey.name}
        noOfResponses = {survey.completedCount}
        lastResponseText = {survey.lastResponseReceivedText}
        onPress={() => {
          if (this.state.isConnected) {
           this.onPushScreen('Dashboard', Dashboard, survey, dataJSON);
          }
        } }/>
    );
  }

  renderView() {
    if (this.state.dataLoaded) {
      let noDataFound = this.state.data.surveys.length === 0;
      if (noDataFound) {
        return this.renderNoDataFound();
      }
      return this.renderSurveyList();
    }

    return (<View></View>)
  }

  renderChild() {

    let contents = this.renderView();

    return (
      <View style={{ flex: 1 }}>
        {contents}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EEEEEE',
  },
  scroll: {
    flex: 1,
    alignSelf: 'stretch'
  },
  toolbar: {
    backgroundColor: '#2F9C0A',
    height: 56,
    alignSelf: 'stretch'
  },
  cardContainer: {
    margin: 5
  }
});
