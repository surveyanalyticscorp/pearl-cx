import React from "react";
import {
  Text,
  View,
  Image,
  Animated,
  ListView,
  Platform,
  TextInput,
  Navigator,
  ScrollView,
  StyleSheet,
  Dimensions,
  processColor,
  NativeModules,
  RefreshControl,
  DeviceEventEmitter,
  NativeEventEmitter,
  TouchableHighlight
} from "react-native";

import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { Actions, ActionConst } from 'react-native-router-flux';

import { ActionCreators } from "../../actions";

import TreeView from "../../../global/widgets/TreeViewWidget";
import BaseComponent from "../../../global/components/BaseComponent";

const { height, width } = Dimensions.get('window');
const factor = width > height ? height : width;
var PageControl = require('react-native-page-control');
const DONUT_COLOR = '#0097DC';
const LINE_COLOR = '#efefef';
const ICON_SIZE = 40;
const TEXT_COLOR = '#7e7e7e';

class OrgTreeView extends BaseComponent {

  constructor(props) {
    super(props);
    this.state = {
      data: props.orgViewData ? props.orgViewData : {}
    };
  }

  componentDidMount() {
    if (!this.props.data) {
      this.reloadContent();
    }
  }

  reloadContent() {
    this.getOrgTreeViewData();
  }

  getOrgTreeViewData() {
    // this.props.fetchOrgViewData().then(() => this.processApiResponse());
    this.props.fetchOrgViewData();
  }

  // processApiResponse() {
  //   if (this.props.error) {
  //     this.showErrorToastAndClear();
  //   }
  // }

  renderChild() {
    return (
      <View style={{ paddingTop: 20 }}>
        {this.renderOrgViewCard()}
      </View>

    );
  }

  renderOrgViewCard() {
    return (
      <TreeView data={this.props.orgViewData}/>
    );
  }

}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(ActionCreators, dispatch);
}

function mapStateToProps(state) {
  return {
    orgViewData: state.orgViewData.body,
    isLoading: state.isLoading,
    // error: state.error.message,
    isConnected: state.isConnected
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(OrgTreeView);
