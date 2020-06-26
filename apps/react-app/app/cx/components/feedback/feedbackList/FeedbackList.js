import React from 'react';
import {ActivityIndicator, Dimensions, FlatList, Platform, View} from 'react-native';
import {Actions} from "react-native-router-flux";

import FeedbackCell from '../feedbackCell';
import {ActionBarModule, AuthenticationModule} from '../../../../global/native-modules/NativeModules';
import BaseComponentWithoutScroll from "../../../../global/components/BaseComponentWithoutScroll";
import CustomText from "../../../../global/ui/CustomText";

const bgImagePath = require('../../../../global/images/background.png');
const { width, height } = Dimensions.get('window');

class Feedback extends BaseComponentWithoutScroll {

  constructor(props) {
    super(props);

    this.state = {
        selectedRowID: null,
        pageIndex: 0,
        isLoadingTail: false,
        authToken : null,
    };
      AuthenticationModule.getAuthToken((token)=>{
          this.setState({authToken: token});
      }, (error)=>{console.log("Error-"+error)});
  }

  componentWillMount() {
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Feedback' }));
    ActionBarModule.toggleBackButton(false);
    if(this.props.isConnected) {
        this.getFeedbackList();
    }

  }

  getFeedbackList(reload = true){
    this.setState({pageIndex: reload? 0 : this.state.pageIndex+ 1},()=>{
        this.props.fetchFeedbacks({pageOffset: this.state.pageIndex}, this.state.isLoadingTail).then(()=>{
            this.setState({isLoadingTail: false})
        });
    })

  }
  componentWillReceiveProps(props) {
    setTimeout(() => {
      this.setState({ selectedRowID: null });
    }, 500);
  }

  _onPressRow = (data) => {
      if (this.state.selectedRowID === null) {
          this.props.setSelectedFeedback(data);
          this.setState({selectedRowID: data.responseSetID}, () => {
              ActionBarModule.toggleBackButton(true);
              ActionBarModule.updateTitleAndMenu(
                  JSON.stringify({
                      title: 'Feedback Detail'
                  })
              );
              Actions.cxFeedbackDetail({authToken: this.state.authToken});

          });
      }

  }

  _renderRow = ({item}) => {
    const selected = this.state.selectedRowID === item.responseSetID ;

    return (
      <FeedbackCell
        item={item}
        onSelect={() => this._onPressRow(item)}
        origin="List"
        ticketStatuses = {this.props.ticketStatuses}
        selected={selected}
      />
    )
  }

  _getBackGroundImage = () => {
    if (Platform.OS != 'ios') {
      return bgImagePath;
    }
    let iosImage = { uri: 'background.png' };
    return iosImage;
  }

  renderChild() {
    const items = this.props.feedbacks? this.props.feedbacks.allResponses : [];
    return (
        <FlatList
            data = {items}
            keyExtractor={item => item.responseSetID}
            renderItem={this._renderRow}
            onEndReached={this.onEndReached}
            onEndReachedThreshold={0.01}
            refreshing={false}
            ListEmptyComponent={this.renderNoDataFound}
            onRefresh={() => {
                this.getFeedbackList(true);
            }}
            ListFooterComponent={this._renderFooter()}
          />
    )
  }
    _renderFooter= () => {
        if (this.state.isLoadingTail) {
            return (
                <ActivityIndicator
                    color={'#003566'}
                    animating={true}
                    size="small"

                />
            )
        }
        return null;
    }

  onEndReached = ()=>{
      // Checking if the list has responses in multiples of 10
    if((this.props.feedbacks.lastAddedCount > 0 && this.props.feedbacks.lastAddedCount % 10 === 0   ) && !this.state.isLoadingTail)
        this.setState({
            isLoadingTail: true
        }, ()=>{
            this.getFeedbackList(false);
        })

  }

  renderNoDataFound = ()=> {
      if (!this.props.isLoading) {
          return (
              <View
                  style={{
                      flex: 1,
                      marginTop: 20,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'transparent'
                  }}
              >
                  <CustomText style={{ color: 'black', fontSize: 16 }}>No feedbacks received.</CustomText>

              </View>
          )
      }
      return <View/>;
  }
}

export default Feedback;
