import React, {Component} from 'react';
import {View, Text, Dimensions, Platform,ActivityIndicator} from 'react-native';

import {
    DotIndicator
} from 'react-native-indicators';

import * as _ from 'lodash';
import ProgressBar from 'react-native-progress/Bar';
import {Actions} from 'react-native-router-flux';

import styles from './style';
import {fetchReviewItems, getNextReview} from '../../../actions/ReviewActions';
import Swiper from '../../swiper/Swiper';
import PopoverModal from '../../popover/Popover';
import LevelMeter from '../../levelMeter/LevelMeter';
import ReviewFlipAnimationView from '../ReviewFlipAnimationView';
import WordCloud from '../../infiniteScrollSquare/InfiniteScroll';
import {ActionBarModule} from '../../../../global/native-modules/NativeModules';

const {width, height} = Dimensions.get('window');
const maxReviewItems = 3;

class ReviewSwiper extends Component {
    constructor(props) {
        super(props);

        this.state = {
            level: 0,
            dataRect: {},
            buttonRect: {},
            reRender: false,
            isVisible: false,
            selectedItems: [],
            levelMeterWidth: 0,
            showTransition: false,
            isSwipeEnabled: false,
            selectedLevelIndex: '',
            popoverContentHeight: 0,
            reviewCategory: props.category,
            attributes:[]
        };

        this._selectedItems = [];
        this._mount = false;
    }

    componentWillMount() {
        this._mount = true;
        this.loadReviewItems();
    }


    loadReviewItems() {
        fetchReviewItems(this.processReviewItemsRecieved.bind(this),{competencyID: this.state.reviewCategory.id},(error) => {
            console.log('error in fetching items');
        });
    }

    processReviewItemsRecieved(response) {
        this.setState({attributes: response.body.attributes});
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

    componentWillReceiveProps(nextProps) {
        // let nextReviewItems = nextProps.reviewItems.slice(0);
        // let reviewItems = this.state.reviewItems;
        // if (!_.isEqual(nextReviewItems, reviewItems)) {
        //   this._mount && this.setState({ reviewItems: nextReviewItems });
        // }
    }

    loading() {
        return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
    }

    render() {

        const {isLoading} = this.props;

        if (isLoading || _.isEmpty(this.state.attributes)) {
            return this.loading();
        }

        let items = this.state.attributes.slice(0);

        return (
            <View style={{flex: 1}}>
                <View
                    style={{
                        shadowColor: '#000000',
                        shadowOffset: {
                            width: 0,
                            height: 3
                        },
                        zIndex: 99,
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
                        styles.header,
                        this.state.showTransition || this.state.selectedItems.length > 0
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
                        showInTransition={this.state.showTransition}
                    />
                </View>
                <Swiper
                    data={this.state.level}
                    style={{flex: 1}}
                    factor={Platform.OS === 'android' ? 1.5 : 1.2}
                    minDataLimit={1}
                    maxDataLimit={4}
                    showInnerArrow={this.state.isVisible}
                    arrowColor={'#979797'}
                    onSwipe={this._onSwipe}
                    onRelease={this._onRelease}
                    isSwipeEnabled={this.state.isSwipeEnabled}
                >
                    <WordCloud
                        ref={'wordCloud'}
                        reviewItems={items}
                        scrollEnabled={!(this.state.isSwipeEnabled || this.state.isVisible)}
                        onWordItemPress={this._onWordItemPress}
                        selectedItems={this.state.selectedItems}
                        contentContainerStyle={{paddingHorizontal: 24}}
                    />

                    <PopoverModal
                        yOffset={32}
                        swipeFactor={1.2}
                        borderWidth={1}
                        minDataLimit={1}
                        maxDataLimit={4}
                        showInnerArrow={true}
                        arrowColor={'#979797'}
                        innerArrowColor={'#FFFFFF'}
                        onRelease={this._onRelease}
                        swipeData={this.state.level}
                        onBgPress={this._onBgPressed}
                        onSwipe={this._onSwipe}
                        visible={this.state.isVisible}
                        fromRect={this.state.buttonRect}
                        containerStyle={styles.popoverContainer}
                        isSwipeEnabled={this.state.isSwipeEnabled}
                    >
                        <View
                            onLayout={({nativeEvent}) =>
                                !this.state.popoverContentHeight &&
                                this.setState({
                                    popoverContentHeight: nativeEvent.layout.height - 10
                                })
                            }
                            style={styles.popoverContent}
                        >
                            <View style={styles.textContainer}>
                                <Text
                                    style={[
                                        styles.red,
                                        {fontWeight: this.state.level === 1 ? 'bold' : 'normal'}
                                    ]}
                                >
                                    Rarely
                                </Text>
                                <Text
                                    style={[
                                        styles.green,
                                        {fontWeight: this.state.level === 4 ? 'bold' : 'normal'}
                                    ]}
                                >
                                    Always
                                </Text>
                            </View>

                            <View
                                style={styles.levelContainer}
                                onLayout={({nativeEvent}) =>
                                    !this.state.levelMeterWidth &&
                                    this.setState({levelMeterWidth: nativeEvent.layout.width})
                                }
                            >
                                <LevelMeter
                                    gap={10}
                                    parentHeight={this.state.popoverContentHeight}
                                    currentLevel={this.state.level}
                                    width={this.state.levelMeterWidth}
                                    onLevelChange={this._onLevelChanged}
                                />
                            </View>
                        </View>
                    </PopoverModal>
                </Swiper>
            </View>
        );
    }

    /**
     * Renders a loading view.
     *
     * @returns {jsx}
     */
    _renderLoadingView = () => (
        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
            <Text>Fetching items list...</Text>
        </View>
    );

    /**
     * Computes progress of the overall reivew process.
     *
     * @returns {number}
     */
    _getProgress = () => {
        let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);

        return (reviewCategoryItems.length + 1) / this.props.maxCompetencyCount - 0.06;
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

    // TODO: Refactor this.
    /**
     * Computes calculations for swipe actions.
     *
     * @param {number} data
     * @param {number} sign
     * @returns {object}
     */
    _onSwipe = (data, sign) => {
        if (this.state.level === data) {
            return;
        }

        if (!this.state.level && sign === 1) {
            return this.setState({level: 3});
        }

        if (!this.state.level && sign === -1) {
            return this.setState({level: 2});
        }

        if (data <= 1) {
            return this.setState({level: 1});
        }

        let convertedData = parseFloat(data.toFixed(1));

        if (convertedData >= 4) {
            convertedData = 4;
        }

        if (convertedData % 1 === 0) {
            this.setState({level: convertedData});
        }
    };

    /**
     * Checks after touch is released from the screen.
     */
    _onRelease = isSwiperMoved => {
        this.setState(
            {
                isVisible: !isSwiperMoved,
                selectedItems: this._selectedItems.slice(0),
                isSwipeEnabled: !isSwiperMoved
            },
            this._setCategoryItems
        );
    };

    // TODO: Refactor this.
    /**
     * Handles necessary computations after a word is clicked. Dimensions for bounding rectangle are calcutated.
     *
     * @param {object} item
     * @param {number} index
     */
    _onWordItemPress = (item, index) => {
        this.setState({isVisible: false});
        this.refs.wordCloud['wordItem_' + index].refs.word.measure(
            (ox, oy, buttonWidth, buttonHeight, px, py) => {
                let currentLevel = 0;
                let selectedLevel = this.state.selectedItems.find(
                    selectedItem => selectedItem.id === item.id
                );
                currentLevel = !!selectedLevel && selectedLevel.boxNumber;

                this.setState({
                    showTransition: true,
                    isVisible: true,
                    isSwipeEnabled: true,
                    selectedItem: item,
                    level: currentLevel,
                    dataRect: {
                        x: 0,
                        y: 0,
                        width,
                        height
                    },
                    buttonRect: {
                        x: px,
                        y: py,
                        width: buttonWidth,
                        height: buttonHeight
                    }
                });
            }
        );
    };

    /**
     * Handles tap on overlay view.
     */
    _onBgPressed = () => {
        this.setState({isVisible: false, isSwipeEnabled: false});
    };

    /**
     * Sets items for a particular category after selection.
     */
    _setCategoryItems = () => {
        if (this.state.selectedItems.length >= this.props.maxCompetencyCount) {
            let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
            let reviewCategory = this.state.reviewCategory;

            reviewCategory.items = this.state.selectedItems;

            if (reviewCategoryItems && reviewCategoryItems.length > 0) {
                let reviewCategoryItemIndex = reviewCategoryItems.findIndex(
                    reviewCategoryItem => reviewCategoryItem.id === reviewCategory.id
                );
                if (reviewCategoryItemIndex > -1) {
                    reviewCategoryItems[
                        reviewCategoryItemIndex
                        ].items = this.state.selectedItems;
                } else {
                    reviewCategoryItems.push(reviewCategory);
                }
            } else {
                if (!Array.of) {
                    Array.of = function () {
                        return Array.prototype.slice.call(arguments);
                    };
                }
                reviewCategoryItems = Array.of(reviewCategory);
            }

            this.props.setReviewCategoryItems(reviewCategoryItems);
            this._changeCategory();
        }
    };

    /**
     * Change category after max number of items for a category has been selected.
     */
    _changeCategory = () => {
        // @sujan Changes to mutate array
        let reviewCategory = this.state.reviewCategory;
        let reviewFilterCategories = this.props.reviewFilterCategories.slice(0);
        let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
        const {lastCategoryReview, nextCategory} = getNextReview(
            reviewCategory,
            reviewFilterCategories
        );
        if (lastCategoryReview || reviewCategoryItems.length >= this.props.maxCompetencyCount) {
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
            }, 1000);
        } else {
            setTimeout(() => {
                Actions.refresh({type: 'push'});
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
    };

    _resetSelection = () => {
        this.setState({
            level: 0,
            dataRect: {},
            buttonRect: {},
            reRender: false,
            isVisible: false,
            selectedItems: [],
            levelMeterWidth: 0,
            showTransition: false,
            isSwipeEnabled: false,
            selectedLevelIndex: '',
            popoverContentHeight: 0,
            //reviewItems: this.props.reviewItems.slice(0),
            reviewCategory: this.props.category
        });

        this._selectedItems = [];
    }

    /**
     * Callback invoked after a level is changed in levelmeter.
     *
     * @param {number} levelIndex
     * @param {boolean} isVisible
     */
    _onLevelChanged = (levelIndex, isVisible) => {
        this.setState({level: levelIndex, isVisible}, () => {
            setTimeout(() => {
                let selectedItem = Object.assign({}, this.state.selectedItem, {
                    boxNumber: levelIndex
                });
                let selectedItemIndex = this._selectedItems.findIndex(
                    item => item.id === selectedItem.id
                );

                if (selectedItemIndex > -1) {
                    this._selectedItems[selectedItemIndex] = selectedItem;

                    return this.setState(
                        {isVisible, isSwipeEnabled: false},
                        this._setSelectedItems
                    );
                }

                this._selectedItems.push(selectedItem);
                this.setState(
                    {isVisible, isSwipeEnabled: false},
                    this._setSelectedItems
                );
            }, 1);
        });
    };

    _setSelectedItems = () => {
        if (!this.state.isVisible) {
            this.setState(
                {
                    isVisible: false,
                    showTransition: false,
                    selectedItems: this._selectedItems.slice(0)
                },
                this._setCategoryItems
            );
        }
    };
}

export default ReviewSwiper;
