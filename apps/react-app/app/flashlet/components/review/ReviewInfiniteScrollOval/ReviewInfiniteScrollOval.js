import React, {Component} from 'react';
import {connect} from 'react-redux';

import {
    View,
    Text,
    Platform,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from 'react-native';

import {
    DotIndicator
} from 'react-native-indicators';

import * as _ from 'lodash';
import {Actions} from 'react-native-router-flux';
import ProgressBar from 'react-native-progress/Bar';

import styles from './style';
import {
    getNextReview,
    fetchReviewItems,
    setReviewCategoryItems
} from '../../../actions/ReviewActions';
import {getColor} from '../../../utils/levelColors';
import ReviewFlipAnimationView from '../ReviewFlipAnimationView';
import {ActionBarModule} from '../../../../global/native-modules/NativeModules';
import ReviewInfiniteScrollWordItem from './ReviewInfiniteScrollWordItem';

const maxReviewItems = 3;
const dispalyPerPage = 50;
const {width} = Dimensions.get('window');
const isCloseToBottom = ({layoutMeasurement, contentOffset, contentSize}) => {
    const paddingToBottom = 30;
    return (
        layoutMeasurement.height + contentOffset.y >=
        contentSize.height - paddingToBottom
    );
};

class ReviewInfiniteScrollOval extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showInTransition: false,
            hideOverlay: false,
            reviewCategory: props.category,
            selectedItems: [],
            recentSelectedItem: '',
            limit: dispalyPerPage,
            loadMoreItems: false,
            attributes:[]
        };

        this._selectedItems = [];
        this.btnPressedItems = [];
        this._mount = false;
    }

    componentWillMount() {
        this.loadReviewItems();
    }

    componentDidMount() {
        this._mount = true;
    }


    loadReviewItems() {
        fetchReviewItems(this.processReviewItemsRecieved.bind(this),{competencyID: this.state.reviewCategory.id},(error) => {
            console.log('error in fetching items');
        });
    }

    processReviewItemsRecieved(response) {
        this.setState({attributes: response.body.attributes})
        ActionBarModule.updateTitleAndMenu(JSON.stringify({title: this.state.reviewCategory.name,image: this.props.selectedEmployeeInfo.avatar}));
    }

    componentWillUnmount() {
        this._mount = false;
        // If reset from summary, on back reset back summary state.
        if (this.props.resetToSummary) {
            this.props.resetToSummary();
            ActionBarModule.updateTitleAndMenu(JSON.stringify({title: 'Summary', image: this.props.avatar}));
            ActionBarModule.toggleBackButton(true);
        } else { // Navigate back to attribute selection screen with previous category title.
            ActionBarModule.updateTitleAndMenu(JSON.stringify({title: this.state.reviewCategory.name}));
            ActionBarModule.toggleBackButton(true);
        }
    }

    onScrollItems(nativeEvent) {
        if (isCloseToBottom(nativeEvent)) {
            this.setState({hideOverlay: true});
            const limit = this.getLimit(this.total);

            if (limit < this.total) {
                this.setState({limit, loadMoreItems: true});
            }

            if (limit === this.total) {
                this.setState({limit, loadMoreItems: false});
            }
        } else {
            this.setState({hideOverlay: false});
        }
    }

    navigateToNextScreen() {
        let reviewCategory = this.state.reviewCategory;
        let reviewFilterCategories = this.props.reviewFilterCategories.slice(0);
        let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);

        const {lastCategoryReview, nextCategory} = getNextReview(
            reviewCategory,
            reviewFilterCategories
        );

        if (
            lastCategoryReview ||
            reviewCategoryItems.length >= this.props.maxCompetencyCount
        ) {
            setTimeout(() => {
                let avatar = this.props.selectedEmployeeInfo.avatar;
                if (this.props.resetToSummary) {
                    Actions.pop();
                } else {
                    Actions.reviewsummary({category: this.state.reviewCategory, reset: this._resetSelection});
                    ActionBarModule.updateTitleAndMenu(
                        JSON.stringify({title: 'Summary', image: avatar})
                    );
                    ActionBarModule.toggleBackButton(true);
                }
                return;
            }, 1000);
        } else {
            setTimeout(() => {
                Actions.attributeSelection({
                    category: nextCategory,
                    currentCategory: this.state.reviewCategory,
                    reset: this._resetSelection
                });
                ActionBarModule.updateTitleAndMenu(
                    JSON.stringify({title: nextCategory.name})
                );
                ActionBarModule.toggleBackButton(true);
            }, 1000);
        }
    }

    _resetSelection = () => {
        this.setState({
            showInTransition: false,
            hideOverlay: false,
            reviewCategory: this.props.category,
            selectedItems: [],
            recentSelectedItem: '',
            limit: dispalyPerPage,
            loadMoreItems: false
        });

        this._selectedItems = [];
        this.btnPressedItems = []; // List of tapped items and prevent more items to be highlighted.
    }

    _onPressButton = item => {
        if (!_.includes(this.btnPressedItems, item.id)) {
            this.btnPressedItems.push(item.id);
        }

        if (this.btnPressedItems.length > this.props.maxCompetencyCount) return;

        this._mount &&
        this.setState({showInTransition: true}, () => {
            setTimeout(() => {
                let selectedItemIndex = this._selectedItems.findIndex(
                    selectedItem => selectedItem.id === item.id
                );

                if (selectedItemIndex > -1) {
                    this._selectedItems[selectedItemIndex] = item;
                } else {
                    this._selectedItems.push(item);
                }

                return (
                    this._mount &&
                    this.setState(
                        {
                            showInTransition: false,
                            selectedItems: this._selectedItems
                        },
                        () => {
                            if (this.state.selectedItems.length >= this.props.maxCompetencyCount) {
                                let reviewCategory = this.state.reviewCategory;
                                let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
                                let selectedItems = this._selectedItems;
                                this.props.setReviewCategoryItems(
                                    reviewCategory,
                                    reviewCategoryItems,
                                    selectedItems
                                );
                                this.navigateToNextScreen();
                            }
                        }
                    )
                );
            }, 1);
        });
    };

    loadingReviewItems() {
        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
    }

    _getProgress = () => {
        let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
        return (reviewCategoryItems.length + 1) / 3 - 0.06;
    };

    _getHeaderText = () => (
        <Text>
            Select {this.props.maxCompetencyCount}{' '}
            <Text style={{fontWeight: 'bold'}}>
                {this.state.reviewCategory.name}
            </Text>{' '}
            qualities from the list below.{`\n`}Scroll to browse.
        </Text>
    );

    getUniqueItems(items) {
        const itemList = [];

        if (items.length > 0) {
            items.forEach(item => {
                let hasItemAdded = false;
                if (itemList.length > 0) {
                    itemList.forEach(listitem => {
                        if (item.id === listitem.id) {
                            hasItemAdded = true;
                        }
                    });
                }
                if (!hasItemAdded) {
                    itemList.push(item);
                }
            });
        }

        return itemList;
    }

    loadingReviewItems() {
        return (
            <View style={styles.loading}>
                <Text>Please wait. Loading review items..</Text>
            </View>
        );
    }

    animate() {
        this.state.width.setValue(0);
        Animated.timing(this.state.width, {
            toValue: 10
        }).start();
    }

    loading() {
        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
    }

    showError(msg) {
        return (
            <View style={styles.error}>
                <Text style={styles.errorTxt}>{msg}</Text>
            </View>
        );
    }

    noresult() {
        return (
            <View style={styles.info}>
                <Text>No Review Items</Text>
            </View>
        );
    }

    getLimit(total) {
        let limit;
        limit = this.state.limit + dispalyPerPage;
        limit = limit > total ? total : limit;
        return limit;
    }

    getPagination(items, offset, limit) {
        this.total = items.length;
        return limit > items.length ? items : items.slice(offset, limit);
    }

    render() {
        const {isLoading, error} = this.props;

        if (isLoading) {
            return this.loading();
        }

        if (error && !this.state.attributes.length) {
            return this.showError(error);
        }

        if (_.isEmpty(this.state.attributes)) {
            return this.loading();
        }

        let items = this.state.attributes.slice(0);
        items = this.getPagination(items, 0, this.state.limit);

        return (
            <View style={{flex: 1}}>
                <View
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        shadowRadius: 2,
                        shadowOpacity: 0.3,
                        elevation: 1
                    }}
                >
                    <ProgressBar
                        color={'#658C36'}
                        height={4}
                        width={width}
                        borderWidth={0}
                        borderRadius={0}
                        progress={this._getProgress()}
                    />
                </View>

                <View
                    style={[
                        {
                            flex: 0.10,
                            justifyContent: 'center',
                            borderBottomWidth: 1,
                            borderBottomColor: 'transparent'
                        },
                        this.state.showInTransition || this.state.selectedItems.length > 0
                            ? {
                                backgroundColor: '#F9F9F9',
                                borderBottomColor: '#F9F9F9',
                                borderBottomWidth: 1
                            }
                            : {}
                    ]}
                >
                    <ReviewFlipAnimationView
                        maxCompetencyCount={this.props.maxCompetencyCount}
                        headerText={this._getHeaderText()}
                        items={this.state.selectedItems}
                        showInTransition={this.state.showInTransition}
                    />
                </View>
                <View style={styles.container}>
                    <ScrollView
                        scrollEventThrottle={100}
                        onScroll={({nativeEvent}) => this.onScrollItems(nativeEvent)}
                    >
                        <View style={styles.viewContainer}>
                            {items.map((item, index) => (
                                <ReviewInfiniteScrollWordItem
                                    key={item.id}
                                    item={item}
                                    disabled={this.state.selectedItems.length >= this.props.maxCompetencyCount}
                                    color={getColor(item.rating)}
                                    rating={item.rating}
                                    onPress={item => this._onPressButton(item)}
                                    selectedItems={this.state.selectedItems}
                                />
                            ))}
                        </View>
                        {this.state.loadMoreItems && (
                            <View style={styles.loadMoreItems}>{this.loading()}</View>
                        )}
                    </ScrollView>
                    {!this.state.hideOverlay ? (
                        <View style={styles.bottomContainerLight}/>
                    ) : null}
                    {!this.state.hideOverlay ? (
                        <View style={styles.bottomContainerDark}/>
                    ) : null}
                    <View style={styles.bottomContainerFixed}/>
                </View>
            </View>
        );
    }
}


export default ReviewInfiniteScrollOval;
