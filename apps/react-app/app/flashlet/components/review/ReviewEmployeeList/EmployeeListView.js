import React, { Component } from 'react';
import {
    View,
    StyleSheet
} from 'react-native';
import { connect } from 'react-redux';


import {
    getReviewInfo
} from "../../../actions/ReviewActions";

import styles from './styles';
import Everyone from '../../employeeList/Everyone/Everyone';
import MyNetwork from '../../employeeList/MyNetwork/MyNetwork';
import MyReviews from '../../employeeList/MyReviews/MyReviews';
import SegmentedControl from '../../segmentControl/SegmentControl';
import {ActionBarModule} from "../../../../global/native-modules/NativeModules";

const menuSegment = {
    MY_NETWORK: 0,
    EVERYONE: 1,
    MY_REVIEWS: 2
};

class HomeView extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isScrollDown: false,
      selectedSegment: props.selectedSegment || menuSegment.MY_NETWORK,
    changingTab: false};
  }

    onTabChange = (index) => {
        this.setState({changingTab: true});
    setTimeout(() => {
      this.setState({ selectedSegment: index, changingTab: false });
    }, 1);
    };

  componentWillMount() {
        this.props.getReviewInfo();
    };

  switchView = () => {

    const origin = this.props.origin;

    switch (this.state.selectedSegment) {
      case menuSegment.MY_NETWORK:
        return <MyNetwork origin={origin} changingTab={this.state.changingTab}/>;
      case menuSegment.EVERYONE:
        return <Everyone origin={origin} changingTab={this.state.changingTab}/>;
      case menuSegment.MY_REVIEWS:
        return <MyReviews origin={origin} changingTab={this.state.changingTab}/>;
    }
  };

    render() {
        return (
            <View style={styles.mainContainer}>
                <SegmentedControl
                    values={['MY NETWORK', 'EVERYONE', 'MY REVIEWS']}
                    onValueChange={(index) => this.onTabChange(index)}
                    selectedIndex={this.state.selectedSegment}
                />
                <View style={styles.contentContainer}>
                    {
                        this.switchView()
                    }
                </View>

            </View>
        );
    }

}

const mapDispatchToProps = dispatch => ({
    getReviewInfo: () => dispatch(getReviewInfo())
});

function setProps(state) {
    return {
        reviewInfo : state.reviewInfo
    };
}
export default connect(setProps,mapDispatchToProps) (HomeView);
