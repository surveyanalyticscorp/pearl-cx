import React, { Component } from 'react';
import {
  Text,
  View,
  Image,
  Platform,
  Dimensions,
  ActivityIndicator,
  TouchableHighlight
} from 'react-native';

import {
    DotIndicator
} from 'react-native-indicators';

import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import ProgressBar from 'react-native-progress/Bar';
import { DragContainer } from '../../dragndrop';
import Icon from 'react-native-vector-icons/FontAwesome';

import styles from './style';
import ReviewDragItems from './ReviewDragItems';
import ReviewDropZones from './ReviewDropZones';
import {fetchReviewItems, getNextReview} from '../../../actions/ReviewActions';
import ReviewFlipAnimationView from '../ReviewFlipAnimationView';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const maxReviewItems = 3;
const displayPerPage = 30;
const { width } = Dimensions.get('window');

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 30;
  return (
    layoutMeasurement.height + contentOffset.y >=
    contentSize.height - paddingToBottom
  );
};

class ReviewDragNDrop extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showTransition: false,
      headerText: (
        <Text>
          Select {this.props.maxCompetencyCount}{' '}
          <Text style={{ fontWeight: 'bold' }}>{props.category.name}</Text>{' '}
          qualities from the list below.
        </Text>
      ),
      recentDropItem: null,
      hasOpenSidebar: false,
      reviewCategory: props.category,
      dragging: false,
      dropZoneBoxWidth: 0,
      dropZoneContentHeight: 0,
      loadMoreItems: false,
      limit: displayPerPage,
      allBoxItems: [],
      reset: false,
      hideOverlay: false,
      attributes:[]
    };
  }

  componentWillMount() {
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
      // If reset from summary, on back reset back summary state.
    if (this.props.resetToSummary) {
      this.props.resetToSummary();
      ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Summary', image: this.props.avatar }));
      ActionBarModule.toggleBackButton(true);
    } else { // Navigate back to attribute selection screen with previous category title.
      ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: this.state.reviewCategory.name }));
      ActionBarModule.toggleBackButton(true);
    }
  }

  _onDragStart(e) {
    this.setState({ dragging: true, reset: false });
    if (this.state.hasOpenSidebar) return;
    this.setState({
      headerText: 'Select a color grade to drag to',
      hasOpenSidebar: true
    });
  }

  _onDragEnd(e) {
    this.setState({ dragging: false });
  }

  _onPresReset = () => {
    this.setState({ allBoxItems: [], reset: true });
  }

  _onScrollItems(nativeEvent) {
    if (isCloseToBottom(nativeEvent)) {
      this.setState({ hideOverlay: true });
      const limit = this.getLimit(this.total);

      if (limit < this.total) {
        this.setState({ limit, loadMoreItems: true });
      }

      if (limit === this.total) {
        this.setState({ limit, loadMoreItems: false });
      }
    } else {
      this.setState({ hideOverlay: false });
    }
  }

  _getProgress = () => {
    let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
    return (reviewCategoryItems.length + 1) / this.props.maxCompetencyCount - 0.06;
  };

  noresult() {
    return (
      <View style={styles.info}>
        <Text>No Review Items</Text>
      </View>
    );
  }

  showError(msg) {
    return (
      <View style={styles.error}>
        <Text style={styles.errorTxt}>{msg}</Text>
      </View>
    );
  }

  loading() {
      return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
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

  _getDropZoneLayout({ nativeEvent }) {
    const dropZoneBoxWidth = nativeEvent.layout.width;
    const dropZoneContentHeight = nativeEvent.layout.height - 100; // Deducted from Top and Bottom height
    this.setState({ dropZoneBoxWidth, dropZoneContentHeight });
  }

  _resetSelection = () => {
    this.setState({
      showTransition: false,
      recentDropItem: null,
      hasOpenSidebar: false,
      reviewCategory: this.props.category,
      dragging: false,
      loadMoreItems: false,
      limit: displayPerPage,
      allBoxItems: [],
      reset: true,
      hideOverlay: false
    });
  }

  checkNextReview() {
    let reviewCategory = this.state.reviewCategory;
    let reviewFilterCategories = this.props.reviewFilterCategories.slice(0);

    const { lastCategoryReview, nextCategory } = getNextReview(
      reviewCategory,
      reviewFilterCategories
    );

    let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
    if (lastCategoryReview || reviewCategoryItems.length >= this.props.maxCompetencyCount) {
      setTimeout(() => {
        let avatar = this.props.selectedEmployeeInfo.avatar;
        if (this.props.resetToSummary) {
          Actions.pop();
        } else {
          Actions.reviewsummary({ category: this.state.reviewCategory, reset: this._resetSelection });
          ActionBarModule.updateTitleAndMenu(
            JSON.stringify({ title: 'Summary', image: avatar })
          );
          ActionBarModule.toggleBackButton(true);
        }
        return;
      }, 1000);
    } else {
      setTimeout(() => {
        Actions.refresh({ type: 'reset' });
        Actions.attributeSelection({ category: nextCategory, currentCategory: this.state.reviewCategory, reset: this._resetSelection });
        ActionBarModule.updateTitleAndMenu(
          JSON.stringify({ title: nextCategory.name })
        );
        ActionBarModule.toggleBackButton(true);
      }, 1000);
    }
  }

  nextReview() {
    this.props.setReviewCategoryItems(
      this.state.reviewCategory,
      this.props.reviewCategoryItems,
      this.state.allBoxItems
    );
    setTimeout(() => {
      this.checkNextReview();
    }, 100);
  }

  isReadyForNext() {
    const boxItemList = this.state.allBoxItems;
    if (boxItemList.length >= this.props.maxCompetencyCount) {
      setTimeout(() => this.nextReview(), 10);
    }
  }

      _onDropReviewItem(allBoxItems) {
          this.setState({ allBoxItems, showTransition: true }, () => {
              setTimeout(() => {
                  const boxItemList = this.state.allBoxItems;
                  if (boxItemList.length >= this.props.maxCompetencyCount) {
                      let reviewCategory = this.state.reviewCategory;
                      let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
                      let allBoxItems = this.state.allBoxItems;
                      this.props.setReviewCategoryItems(
                          reviewCategory,
                          reviewCategoryItems,
                          allBoxItems
                      );
                      this.checkNextReview();
                  }
              }, 1)
          });
      }


      _getImageUri(src) {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  }

  render() {
    const { isLoading, error } = this.props;

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

    const allBoxItems = this.state.allBoxItems;

    const disabled = allBoxItems.length >= this.props.maxCompetencyCount;

    return (
      <View style={{ flex: 1 }}>
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
            this.state.showTransition || this.state.allBoxItems.length > 0
              ? {
                backgroundColor: '#F9F9F9',
                borderBottomColor: '#F9F9F9',
                borderBottomWidth: 1
              }
              : {}
          ]}
        >
          <ReviewFlipAnimationView
              maxCompetencyCount = {this.props.maxCompetencyCount}
            headerText={this.state.headerText}
            items={this.state.allBoxItems}
            showInTransition={this.state.showTransition}
          />
        </View>
        <View style={styles.container}>
          <DragContainer
            onDragStart={e => this._onDragStart(e)}
            onDragEnd={e => this._onDragEnd(e)}
          >
            <View style={styles.content}>
              <View style={[styles.itemWrapper]}>
                <ReviewDragItems
                  dragging={this.state.dragging}
                  allBoxItems={allBoxItems}
                  reviewItems={items}
                  onScrollItems={nativeEvent =>
                    this._onScrollItems(nativeEvent)
                  }
                  loadMoreItems={this.state.loadMoreItems}
                  hideOverlay={this.state.hideOverlay}
                />
              </View>
              <View
                onLayout={this._getDropZoneLayout.bind(this)}
                style={styles.dropZoneArea}
              >
                <ReviewDropZones
                  onDropReviewItem={allBoxItems =>
                    this._onDropReviewItem(allBoxItems)
                  }
                  dropZoneBoxWidth={this.state.dropZoneBoxWidth}
                  dropZoneContentHeight={this.state.dropZoneContentHeight}
                  dragging={this.state.dragging}
                  reset={this.state.reset}
                />
              </View>
            </View>
          </DragContainer>
          <View style={styles.resetBtn}>
            {!disabled &&
              allBoxItems.length > 0 && (
                <TouchableHighlight
                  onPress={this._onPresReset}
                  underlayColor={'rgba(0, 0, 0, 0.09)'}
                >
                  <Image
                    style={styles.resetBtnImg}
                    source={this._getImageUri('reset.png')}
                  />
                </TouchableHighlight>
              )}
          </View>
        </View>
      </View>
    );
  }
}

export default ReviewDragNDrop;
