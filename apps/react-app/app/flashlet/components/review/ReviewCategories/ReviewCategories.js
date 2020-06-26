import React, { Component } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';

import {
    DotIndicator
} from 'react-native-indicators';

import * as _ from 'lodash';
import { Actions } from 'react-native-router-flux';
import ReviewFlipAnimationView from '../ReviewFlipAnimationView';

import styles from './style';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

const MAX_ALLOW_CATEGORIES = 3;
const displayPerPage = 30;

const isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
  const paddingToBottom = 30;
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - paddingToBottom;
};

class ReviewCategories extends Component {
  constructor() {
    super();

    this.state = {
      selectedCategories: [],
      selectedCategory: null,
      limit: displayPerPage,
      loadMoreItems: false,
      showInTransition: false
    };
    this._selectedCategories = [];
    this.hasPressedCategory = false;
  }

  componentWillMount() {
    this.props.dispatch({ type: 'REVIEW_CATEGORY_ITEMS', payload: [] });
    let reviewCategories = this.props.reviewCategories;
    if (!reviewCategories.length) {
      this.props
        .fetchReviewCategories()
        .then(() => { })
        .catch(e => console.log(e.toString()));
    }
  }

  componentDidMount() {
    ActionBarModule.updateTitleAndMenu(
      JSON.stringify({ title: 'Performance Review', image: this.props.selectedEmployeeInfo.avatar })
    );
  }

  componentWillUnmount() {
    // Navigate back to employee list screen.
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: 'Performance Review' }));
    ActionBarModule.toggleBackButton(true);
  }

  onPressCategory(category) {
    if (this.hasPressedCategory || this.state.showTransition) return;

    this.hasPressedCategory = true;
    this.setState({ showInTransition: true }, () => {
      setTimeout(() => {
        let selectedCategoryIndex = this._selectedCategories.findIndex(
          selectedCategory => selectedCategory.id === category.id
        );

        if (selectedCategoryIndex > -1) {
          this._selectedCategories.splice(selectedCategoryIndex, 1);
        } else {
          this._selectedCategories.push(category);
        }

        this.hasPressedCategory = false;
        this.setState({ selectedCategories: this._selectedCategories.slice(0), selectedCategory: category }, () => {
          if (this.state.selectedCategories.length >= this.props.maxCompetencyCount) {
            this.navigateToNextScreen();
          }
        });
      }, 1);
    });
  }

  navigateToNextScreen = () => {
    setTimeout(() => {
      const filterCategories = this.state.selectedCategories;
      const actionPages = _.shuffle([1, 2, 3]);

      /*filterCategories.forEach((filterCategory, index) => {
        filterCategories[index] = Object.assign({}, filterCategory, { nextActionPage: actionPages[index] });
      });*/

      this.props.dispatch({ type: 'REVIEW_FILTER_CATEGORIES', payload: filterCategories });
      this.props.dispatch({ type: 'REVIEW_CATEGORY_ITEMS' });

      const dispatchCategory = filterCategories[0];
      Actions.attributeSelection({ category: dispatchCategory,  reset: this._resetCategories });
      ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: dispatchCategory.name }));
      ActionBarModule.toggleBackButton(true);
    }, 1500);
  };

  _resetCategories = () => {
    this.setState({ selectedCategories: [], selectedCategory: null, showInTransition: false });
    this._selectedCategories = [];
    this.hasPressedCategory = false;
  }

  loadingReviewItems() {
    return (
      <View style={styles.loading}>
        <Text>Please wait. Loading review categories..</Text>
      </View>
    );
  }

  hasSelectedCategory(catId) {
    let hasSelected = false;
    const selectedCategories = this.state.selectedCategories;

    if (selectedCategories.length > 0) {
      selectedCategories.forEach(category => {
        if (category.id === catId) {
          hasSelected = true;
        }
      });
    }
    return hasSelected;
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
        <Text>No Competencies</Text>
      </View>
    );
  }

  getLimit(total) {
    let limit;
    limit = this.state.limit + displayPerPage;
    limit = limit > total ? total : limit;
    return limit;
  }

  getPagination(items, offset, limit) {
    this.total = items.length;
    return limit > items.length ? items : items.slice(offset, limit);
  }

  onScrollItems(nativeEvent) {
    if (isCloseToBottom(nativeEvent)) {
      const limit = this.getLimit(this.total);

      if (limit < this.total) {
        this.setState({ limit, loadMoreItems: true });
      }
      if (limit === this.total) {
        this.setState({ limit, loadMoreItems: false });
      }
    }
  }

  render() {
    const { isLoading, error, reviewCategories } = this.props;

    if (isLoading) {
      return this.loading();
    }
    
    if (error && !reviewCategories.length) {
      return this.showError(error);
    }

    if (!reviewCategories.length) {
      return this.noresult(error);
    }

    if (_.isEmpty(reviewCategories)) {
      return this.noresult();
    }

    let items = reviewCategories.slice(0);
    items = this.getPagination(items, 0, this.state.limit);

    return (
      <View style={styles.container}>
        <View
          style={[
            styles.header,
            this.state.showInTransition || this.state.selectedCategories.length > 0
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
            headerText={'Select ' + this.props.maxCompetencyCount}
            items={this.state.selectedCategories}
            showInTransition={this.state.showInTransition}
          />
        </View>
        <ScrollView
          scrollEventThrottle={100}
          onScroll={({ nativeEvent }) => this.onScrollItems(nativeEvent)}
        >
          <View style={styles.content}>
            {
              items.map((category, i) => {
                if (_.isEmpty(category.name)) return;
                const hasSelectedCategory = this.hasSelectedCategory(category.id);

                return (
                  <TouchableOpacity
                    disabled={this.state.selectedCategories.length >= this.props.maxCompetencyCount || this.hasPressedCategory}
                    style={hasSelectedCategory ? styles.itemSelected : styles.item} key={i}
                    onPress={() => this.onPressCategory(category)}>
                    <View>
                      <Text
                        numberOfLines={1}
                        style={hasSelectedCategory ? styles.categoryTxtSelected : styles.categoryTxt}>{category.name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })
            }
          </View>
          {this.state.loadMoreItems && <View style={styles.loadMoreItems}>{this.loading()}</View>}
        </ScrollView>
      </View>
    );
  }
}

export default ReviewCategories;
