import React, { Component } from 'react';
import {
  Text,
  View,
  Alert,
  Image,
  Animated,
  Platform,

  ScrollView,
  Dimensions,
  LayoutAnimation,
  TouchableOpacity,
  TouchableHighlight,
  TouchableWithoutFeedback
} from 'react-native';

import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import GestureRecognizer, { swipeDirections } from '../../swipeGesture';

import styles from './style';
import { getColor } from '../../../utils/levelColors';
import { trimSpaces } from '../../../utils/stringPrototype';
import { getReviewNextAction } from '../../../actions/ReviewActions';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const { width } = Dimensions.get('window');
const CustomLayoutLinear = {
    duration: 400,
    create: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
    },
    update: {
        type: LayoutAnimation.Types.linear
    },
    delete: {
        type: LayoutAnimation.Types.linear,
        property: LayoutAnimation.Properties.opacity
    }
};
const config = {
    velocityThreshold: 0.1,
    directionalOffsetThreshold: 40
};

class ReviewSummary extends Component {
  constructor(props) {
    super(props);
    this.state = {
      left: 0,
      avatar: props.reviewEmployee.avatar,
      category: '',

      swipeId: null,
      resetHeight: 50,
      commentId: null,
      showReset: false,

      reviewSubmitted: false,
      reviewSubmitting: false,
      isEditable: props.editable ? false : true,
      reviewCategoryItems: props.reviewCategoryItems.slice(0)
    };

    this.animated = new Animated.Value(0);

      this.isReset = false;
  }

  componentWillUnmount() {
    if(!this.isReset) {
      if (this.props.reset) { // Navigate back to item selection screen and reset the state of previous screen.
        this.props.reset();
        this._removePreviousState();
        ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: this.props.category.name }));
        ActionBarModule.toggleBackButton(true);
      } else if (this.props.navFromReview) { // Navigate back to my reviews list.
        this.props.navFromReview();
        ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Performance Review' }));
        ActionBarModule.toggleBackButton(false);
      }
    }
  }

  _removePreviousState =() =>{
    let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
    let length = reviewCategoryItems.length;
    reviewCategoryItems.pop();
    this.props.dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: reviewCategoryItems });

    let filterCategories = this.props.reviewFilterCategories.slice(0);
    let newFilterCategories = filterCategories.map((filterCategory, index) => {
      if (index === length - 1) {
        delete filterCategory["items"]
      }
      return filterCategory;
    })
    this.props.dispatch({ type: 'REVIEW_FILTER_CATEGORIES', payload: newFilterCategories });
  }

  onPressComment(category) {
    let commentId = category.id;  this.setState({ commentId, category }) ;

         this.setState({ showReset: false, swipeId: null, left: 0 }, () => {
        Actions.commentView({
      category,
      value: this.getCommentText(category.id),
        setCommentText:this.setCategoryComment,
        avatar:this.state.avatar
      });
    ActionBarModule.updateTitleAndMenu(
  JSON.stringify({
    title: 'Summary',
    image: 'arrowRightWhite',
    isStatic: true
})
    );
    ActionBarModule.toggleBackButton( true );
    });
  }

    onSwipeLeft(swipeId) {
        this.setState(
            {
                showReset: true,
                swipeId,
                left: this.animated.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, -(width / 3)]
                })
            },
            () => {
                Animated.spring(this.animated, {
                    toValue: 1,
                    tension: 60,
                    friction: 10
                }).start();
            }
        );
    }

    onSwipeRight(swipeId) {
        this.setState({ showReset: false, swipeId }, () => {
            Animated.spring(this.animated, {
                toValue: 0,
                tension: 40,
                friction: 7
            }).start(() => (this.animated = new Animated.Value(0)));
        });
    }

    onItemLayout({ nativeEvent }) {
        this.setState({ resetHeight: nativeEvent.layout.height - 10 });
    }

  onResetSummaryReview(categoryId) {
    Alert.alert(
      'Reset',
      'Do you want to reset the review items for this category?',
      [
        { text: 'OK', onPress: () => this.onConfirmReset(categoryId) },
        {
          text: 'Cancel',
          onPress: (() => {
        this.setState({ showReset: false, swipeId: null, left: 0 });
          })}
      ],
      { cancelable: false }
    );
  }

  onConfirmReset = categoryId => {
    //let category;
    //const categoryItems = [];
    //this.state.reviewCategoryItems.forEach(categoryItem => {
    //  if (categoryItem.id === categoryId) {
    //    category = categoryItem;
    //    categoryItem.items = [];
    //  }
    //  categoryItems.push(categoryItem);
    // });

    // this.props.dispatch({
    //   type: 'REVIEW_CATEGORY_ITEMS',
    //   payload: categoryItems
    // });
    let category;
    let categoryItems = [];
    let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
    reviewCategoryItems.forEach(categoryItem => {
      if (categoryItem.id === categoryId) {
        category = categoryItem;
      }
      categoryItems.push(categoryItem);});

        this.props.dispatch({
            type: 'REVIEW_CATEGORY_ITEMS',
            payload: categoryItems
        });

    this.isReset = true;
    Actions[getReviewNextAction(category.nextActionPage)]({ category, resetToSummary: this.setBackNav, avatar: this.state.avatar });
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({ title: category.name })
    );
    ActionBarModule.toggleBackButton(true);
  };

  setBackNav = () => {
    this.setState({ showReset: false, swipeId: null, left: 0 });
    this.isReset =false;
  }

    onSubmitReview() {
        if (this.state.reviewSubmitting) return;

    this.setState({ reviewSubmitting: true });
    let reviewMyReviews = this.props.reviewMyReviews;const myreviews = _.isArray(reviewMyReviews)
      ? reviewMyReviews.slice(0)
      : [];
    const reviewEmployee = this.props.reviewEmployee;

      reviewEmployee.reviewCategories = this.state.reviewCategoryItems;
      reviewEmployee.filterCategories = this.props.reviewFilterCategories.slice(0);
this.props.submitReviewResponse(reviewEmployee);
      myreviews.push(reviewEmployee);
    this.props.setReviews(myreviews);
this.props.resetCategoryItems([]);
    //this.props.resetFilterCategories([]);
    setTimeout(
      () =>
        this.setState(
          { reviewSubmitting: false, reviewSubmitted: true, isEditable: false },
          () => {
            setTimeout(() => {
              Actions.employeeList({ selectedSegment: 2 });
              ActionBarModule.toggleBackButton(false);ActionBarModule.updateTitleAndMenu(
                JSON.stringify({ title: 'Performance Review' })
              );

            }, 1000);
          }
        ),
      1000
    );
  }

  getCommentText(categoryId) {
    let comment = '';
    let reviewCategoryItems = this.state.reviewCategoryItems;
    const reviewCategory =reviewCategoryItems.find(
      reviewCategoryItem => reviewCategoryItem.id === categoryId
    );

        if (reviewCategory.comment) {
            comment = reviewCategory.comment;
        }

        return comment;
    }

  getCommentTextHeight(categoryId) {
    let height = 30;
    let reviewCategoryItems = this.state.reviewCategoryItems;
    const reviewCategory =reviewCategoryItems.find(
      reviewCategoryItem => reviewCategoryItem.id === categoryId
    );

        if (reviewCategory.comment) {
            height = Math.round(reviewCategory.height);
        }

        return { height };
    }

  setCategoryComment=(catid, text) =>{
    let reviewCategoryItems = this.state.reviewCategoryItems;
    let reviewCategoryIndex = reviewCategoryItems.findIndex(
      reviewCategoryItem => reviewCategoryItem.id === catid
    );
    let reviewCategory = reviewCategoryItems[reviewCategoryIndex];
    let inputText = trimSpaces(text);
    reviewCategoryItems[reviewCategoryIndex] = Object.assign(
      {},
      reviewCategory,
      {
        comment: inputText.length > 0 ? text : inputText
      }
    );

    console.log('HERE:::', this.state.reviewCategoryItems);

    this.setState({ reviewCategoryItems });
  }

  hasComment = categoryId => {
    let reviewCategoryItems = this.state.reviewCategoryItems;
    const reviewCategory =reviewCategoryItems.find(
      reviewCategoryItem => reviewCategoryItem.id === categoryId
    );

        if (reviewCategory.comment) {
            return true;
        }

        return false;
    };

    _getImageUri(src) {
        if (Platform.OS === 'android') {
            return { uri: `asset:/${src}` };
        }

        return { uri: src };
    }

  render() {
    const { reviewFilterCategories, reviewCategoryItems } = this.props;


    let filterItems = reviewFilterCategories.slice(0) ;
      let categoryItems = reviewCategoryItems.slice(0);

          console.log('FROM RENDER:::',this.state.reviewCategoryItems);

    return (
      <View style={{ flex: 1 }}>
        {this.state.reviewSubmitted && (
          <View style={styles.reviewSubmitted}>
            <Image source={this._getImageUri('check_greenBg.png')} style={{ width: 22, height: 22 }} />
            <Text style={styles.reviewSubmittedTxt}>Review Submitted!</Text>
          </View>
        )}
        <View style={styles.container}>
          <ScrollView>
            <View style={styles.content}>
              {filterItems.map((category, i) => {
                return (
                  <View key={i}>
                    {categoryItems.length > 0 &&
                      categoryItems.map((ritem, i) => {
                        if (ritem.id === category.id) {
                          return (
                            <Animated.View
                              key={`${this.state.swipeId}-${i}`}

                              style={{
                                flex: 1,
                                left:
                                  this.state.swipeId === category.id
                                    ? this.state.left
                                    : 0
                              }}
                            >
                              <GestureRecognizer
                                onSwipeLeft={() =>
                                  this.state.isEditable &&
                                  this.onSwipeLeft(category.id)
                                }
                                onSwipeRight={() =>
                                  this.state.isEditable &&
                                  this.onSwipeRight(category.id)
                                }
                                config={config}
                              >
                                <View
                                  onLayout={
                                    this.state.swipeId === category.id
                                      ? this.onItemLayout.bind(this)
                                      : null
                                  }
                                  style={[
                                    styles.item,
                                    {
                                      width:
                                        Platform.OS === 'android' &&
                                          this.state.showReset &&
                                          this.state.swipeId === category.id
                                          ? width + width / 3
                                          : width - 10
                                    }
                                  ]}
                                >
                                  <View
                                    style={{
                                      flex: 1,
                                      backgroundColor: 'rgb(248, 248, 248)',
                                      marginTop: 10,
                                      padding: 10
                                    }}
                                  >
                                    <TouchableWithoutFeedback
                                      disabled={!this.state.isEditable}
                                      onPress={() =>
                                        this.onPressComment(category)
                                      }
                                    >
                                      <View>
                                        <View style={styles.header}>
                                          <Text style={styles.categoryTxt}>{category.name.toUpperCase()}</Text>
                                          <Image style={{ width: 16, height: 16 }} source={this._getImageUri(this.hasComment(category.id)
                                            ? 'comment-i.png'
                                            : 'comment-o.png')} />
                                        </View>
                                        <View
                                          style={styles.reviewCategoryLayout}
                                        >
                                          {ritem.items &&
                                            ritem.items.map((item, j) => {
                                              const boxNumber =
                                                item.boxNumber &&
                                                  item.boxNumber > 0
                                                  ? item.boxNumber
                                                  : item.rating;
                                              return (
                                                <View
                                                  style={[
                                                    styles.reivewCategoryItem,
                                                    {
                                                      borderColor: getColor(
                                                        boxNumber
                                                      )
                                                    }
                                                  ]}
                                                  key={`reviewitem-${j}`}
                                                >
                                                  <Text
                                                    style={[
                                                      styles.categoryItemTxt,
                                                      {
                                                        color: getColor(
                                                          boxNumber
                                                        )
                                                      }
                                                    ]}
                                                  >
                                                    {item.name}
                                                  </Text>
                                                </View>
                                              );
                                            })}
                                        </View>
                                      </View>
                                    </TouchableWithoutFeedback>
                                    {(
                                      this.hasComment(category.id)) &&
                                      (  <TouchableWithoutFeedback
                                          disabled={!this.state.isEditable}
                                          onPress={() =>
                                            this.onPressComment(category)
                                          }
                                        >
                                          <View>
                                            <Text
                                              ref={`commentBox-${category.id}`}
                                              style={[
                                                Platform.OS === 'android' &&
                                                  this.state.showReset
                                                  ? styles.commentBoxAndroid
                                                  : styles.commentBox,
                                                this.getCommentTextHeight(
                                                  category.id
                                                )
                                              ]}
                                            >
                                              {this.getCommentText(category.id)}
                                            </Text>
                                          </View>
                                        </TouchableWithoutFeedback>
                                      )
                                  }</View>
                                  {this.state.showReset &&
                                    this.state.swipeId === category.id && (
                                      <View
                                        style={[
                                          Platform.OS === 'android'
                                            ? styles.resetBoxWrapperAndroid
                                            : styles.resetBoxWrapper,
                                          { height: this.state.resetHeight }
                                        ]}
                                      >
                                        <TouchableOpacity
                                          style={{ flex: 1 }}
                                          onPress={() =>
                                            this.onResetSummaryReview(
                                              category.id
                                            )
                                          }
                                          hitSlop={{
                                            top: 10,
                                            left: 10,
                                            right: 10,
                                            bottom: 10
                                          }}
                                        >
                                          <View
                                            style={
                                              Platform.OS === 'android'
                                                ? styles.resetBoxContainerAndroid
                                                : styles.resetBoxContainer
                                            }
                                          >
                                            <Text
                                              style={
                                                 styles.resetTxt
                                              }
                                            >
                                              Reset
                                            </Text>
                                          </View>
                                        </TouchableOpacity>
                                      </View>
                                    )}
                                </View>
                              </GestureRecognizer>
                            </Animated.View>
                          );
                        }
                      })}
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
        {this.state.isEditable ? (
          <TouchableHighlight onPress={this.onSubmitReview.bind(this)}>
            <View style={styles.buttonContainer}>
              <View style={styles.button}>
                <Text style={styles.buttonTxt}>Submit</Text>
              </View>
            </View>
          </TouchableHighlight>
        ) : (
            <View />
          )}
        {this.state.reviewSubmitting ? (
          <View style={styles.overlay}>
            <Text style={styles.overlayTxt}>Please wait. Submitting..</Text>
          </View>
        ) : (
            <View />
          )}
      </View>
    );
  }
}



export default ReviewSummary;
