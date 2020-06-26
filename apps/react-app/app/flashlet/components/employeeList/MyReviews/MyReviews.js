import React, { Component } from 'react';
import {
  View,
  Text,
  ListView,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator
} from 'react-native';

import {
    DotIndicator
} from 'react-native-indicators';
import { connect } from 'react-redux';
import { Actions } from 'react-native-router-flux';
import {
    fetchMyReviews,
    fetchMyReviewRequests,
    fetchMyReviewsReceived,
    fetchReceivedRequests,
    setEmployeeInfo
} from '../../../actions/ReviewActions';
import EmployeeCell from '../EmployeeView';

import * as _ from 'lodash';

import styles from './MyReviewStyle';
import ReviewCell from './MyReviewView';
import RequestReviewCell from './MyRequestReviewView';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const displayPerPage = 30;

class MyReview extends Component {

    constructor(props) {
        super(props);
        this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
        this.state = {
            text: "",
            limit: displayPerPage,
            loadMoreItems: false,
            selectedRow: null
        };
        this.total = 0;
    }

    componentWillMount() {
        this.props.fetchMyReviews();
        this.props.fetchMyRequests();
        this.props.fetchMyReviewsReceived();
        this.props.fetchReceivedRequests();
    }

    onPressEmployee(user, rowID) {
        //this.props.dispatch({ type: "REVIEW_EMPLOYEE", data: user });

        if (user.reviewCategories.length > 0) {
            this.props.setFilterCategories(user.reviewCategories);
            this.props.setReviewCategories(user.reviewCategories);
        }
        this.setState({ selectedRow: rowID }, () => {
            setTimeout(() => {
                Actions.reviewsummary({ editable: 1, navFromReview: this.navigateBack });
                Actions.refresh();
                let avatar = user.avatar;
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({ title: "Summary", image: avatar })
                );
                ActionBarModule.toggleBackButton(true);
            }, 200);
        });
    }

  navigateBack = () => {
    this.setState({ selectedRow: null });
  }

  getPagination(items, offset, limit) {
    this.total = items.length;
    return limit > items.length ? items : items.slice(offset, limit);
  }

    getLimit(total) {
        let limit;
        limit = this.state.limit + displayPerPage;
        limit = limit > total ? total : limit;
        return limit;
    }

    _renderRow(rowData, sectionID, rowID, highlightRow) {
        const reviewCategories = [];

        if (rowData.reviewCategories.length > 0) {
            rowData.reviewCategories.forEach(category =>
                reviewCategories.push(category.name)
            );
        }
        const selected = this.state.selectedRow === rowID ? true : false;
        return (
            <TouchableOpacity
                onPress={() => this.onPressEmployee(rowData, rowID)}
                underlayColor={'rgba(0, 0, 0, 0.04)'}
            >
              <View style={[styles.cellContainer, { backgroundColor: selected ? 'rgba(0, 0, 0, 0.08)' : 'white' }]}>
                <ReviewCell
                    item={rowData}
                    reviewCategories={reviewCategories.join(', ')}
                />
                <View style={styles.bottomView} />
              </View>
            </TouchableOpacity>
        );
    }


    _renderRowForReceivedRequests(rowData, sectionID, rowID, highlightRow) {
        return (
            <TouchableOpacity
                onPress={() => this.onPressEmployeeForReview(rowID,rowData)}
                underlayColor={'rgba(0, 0, 0, 0.04)'}
            >
                <View style={[styles.cellContainer, { backgroundColor: 'white' }]}>
                    <RequestReviewCell
                        item={rowData}
                        arrow={true}
                    />
                    <View style={styles.bottomView} />
                </View>
            </TouchableOpacity>
        );
    }

    _isSelected(rowID) {
            return this.state.selectedRow === rowID;

    }

    onPressEmployeeForReview(rowID, selectedEmployee) {
            this.handleSelectEmployeeForReview(rowID,selectedEmployee);
    }

    handleSelectEmployeeForReview(rowID, selectedEmployee) {
        this.props.setEmployeeInfo(selectedEmployee);
        this.setState({selectedRow: rowID}, () => {
            setTimeout(() => {
                Actions.refresh({type: 'push'});
                Actions.competencySelection({navFunc: this.navigateBack});
                ActionBarModule.toggleBackButton(true);
            }, 300);
        });
    }
    _renderRowForRequests(rowData, sectionID, rowID, highlightRow) {

        return (
            <TouchableOpacity
                onPress={() => console.log('Do nothing')}
                underlayColor={'rgba(0, 0, 0, 0.04)'}
            >
              <View style={[styles.cellContainer, { backgroundColor: 'white' }]}>
                <RequestReviewCell
                    item={rowData}
                />
                <View style={styles.bottomView} />
              </View>
            </TouchableOpacity>
        );
    }


    loading() {
        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>
    }

    showError(msg) {
        return (
            <View style={styles.error}>
              <Text>{msg}</Text>
            </View>
        );
    }

    noresult(text) {
        return (
            <View style={styles.cell}>
                <View
                    style={{
                        flex: 1,
                        paddingLeft: 12,
                        paddingRight: 18,
                        flexDirection: 'column'
                    }}
                >
                    <View
                        style={{
                            flex: 1,
                            paddingBottom: 4,
                            alignItems: 'center',
                            flexDirection: 'row',
                            justifyContent: 'space-between'
                        }}
                    >
                        <Text>{text}</Text>
                    </View>
                </View>
            </View>
        );
    }

    _onEndReached() {
        const limit = this.getLimit(this.total);

        if (limit < this.total) {
            this.setState({ loadMoreItems: true, limit });
        }

        if (limit === this.total) {
            this.setState({ loadMoreItems: false, limit });
        }
    }

    _renderFooter() {
        if (!this.state.loadMoreItems) return <View />;

        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
    }

    hydrateMyReviews(reviewMyReviews) {

        for(let i = 0; i < reviewMyReviews.length;i++){
            reviewMyReviews[i].reviewCategories = this.state.reviewCategoryItems;
            reviewMyReviews[i].filterCategories = this.props.reviewFilterCategories;

        }

    }

    render() {
        const { isLoading, error, reviewMyReviews, reviewMyRequests, reviewMyReviewsReceived, requestsReceived } = this.props;
        //this.hydrateMyReviews(reviewMyReviews);
        let items = reviewMyReviews;
        let reviewRequestItems = reviewMyRequests;
        let reviewsReceivedItems = reviewMyReviewsReceived;
        let requestsReceivedToME = requestsReceived;

        if(!reviewsReceivedItems ) {
            return this.loading();
        }

        if (isLoading) {
            return this.loading();
        }

    if (error && !items.length) {
      return this.showError(error);
    }


    if (items.length > 0) {
      items = this.getPagination(items.slice(0), 0, this.state.limit);
    }

        return (

            <ScrollView style={{ flex: 1 }}>
                <View style={{height:40, backgroundColor:'#C0C0C0'}}>
                    <Text style={{fontSize: 18,left:10,top:5,bottom:5}}>
                        {'Provided'}
                    </Text>
                </View>
                {items.length > 0 && (
                    <ListView
                        dataSource={this.ds.cloneWithRows(items)}
                        renderRow={this._renderRow.bind(this)}
                        onEndReachedThreshold={100}
                        onEndReached={this._onEndReached.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                    />
                )}

                {!items.length && this.noresult('No Reviews Provided')}

                <View style={{height:40, backgroundColor:'#D3D3D3'}}>
                    <Text style={{fontSize: 20,left:10,top:5,bottom:5}}>
                        {'Received'}
                    </Text>
                </View>
                {reviewsReceivedItems.length > 0 && (
                    <ListView
                        dataSource={this.ds.cloneWithRows(reviewsReceivedItems)}
                        renderRow={this._renderRow.bind(this)}
                        onEndReachedThreshold={100}
                        onEndReached={this._onEndReached.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                    />
                )}

                {!reviewsReceivedItems.length && this.noresult('No Reviews Received')}




                <View style={{height:40, backgroundColor:'#D3D3D3'}}>
                    <Text style={{fontSize: 20,left:10,top:5,bottom:5}}>
                        {'Pending Requests - Sent'}
                    </Text>
                </View>
                {reviewRequestItems.length > 0 && (
                    <ListView
                        dataSource={this.ds.cloneWithRows(reviewRequestItems)}
                        renderRow={this._renderRowForRequests.bind(this)}
                        onEndReachedThreshold={100}
                        onEndReached={this._onEndReached.bind(this)}
                        renderFooter={this._renderFooter.bind(this)}
                    />
                )}

                {!reviewRequestItems.length && this.noresult('No Pending Review Requests')}


                <View style={{height:40, backgroundColor:'#D3D3D3'}}>
                    <Text style={{fontSize: 20,left:10,top:5,bottom:5}}>
                        {'Pending Requests - Received'}
                    </Text>
                </View>

                {requestsReceivedToME.length > 0 && (
                    <View style={{minHeight:100}}>

                    <ListView
                        dataSource={this.ds.cloneWithRows(requestsReceived)}
                        renderRow={this._renderRowForReceivedRequests.bind(this)}
                    />
                    </View>

                )}

                { !requestsReceivedToME.length && this.noresult('No Requests Received')}



            </ScrollView>
        );
    }
}

function setProps(store) {
    return {
        reviewMyReviews: store.reviewMyReviews,
        reviewMyRequests: store.reviewMyRequests,
        reviewMyReviewsReceived: store.reviewMyReviewsReceived,
        requestsReceived: store.requestsReceived,
        reviewCategories: store.reviewCategories,
        reviewCategoryItems: store.reviewCategoryItems,
        reviewFilterCategories: store.reviewFilterCategories,
        isLoading: store.isLoading,
        error: store.error.message,
        isConnected: store.isConnected
  };
}


const mapDisPatchToProps = (dispatch) => ({
    fetchMyReviews: () => dispatch(fetchMyReviews()),
    fetchMyRequests: () => dispatch(fetchMyReviewRequests()),
    fetchReceivedRequests: () => dispatch(fetchReceivedRequests()),
    setEmployeeInfo: selectedEmployee => dispatch(setEmployeeInfo(selectedEmployee)),
    fetchMyReviewsReceived: () => dispatch(fetchMyReviewsReceived()),
    setFilterCategories: (filterCategories) => dispatch({ type: 'REVIEW_FILTER_CATEGORIES', payload: filterCategories }),
    setReviewCategories: (reviewCategories) => dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: reviewCategories })
});

export default connect(setProps,mapDisPatchToProps)(MyReview);
