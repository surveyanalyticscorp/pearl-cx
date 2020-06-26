import React, { Component } from 'react';
import {
  View,
  Text,
  Image,
  Platform,
  TouchableOpacity
} from 'react-native';

import { Actions } from 'react-native-router-flux';

import styles from './style';
import FadeInView from '../FadeInView';
import { getReviewNextAction } from '../../../actions/ReviewActions';
import { ActionBarModule } from '../../../../global/native-modules/NativeModules';

class AttributeSelection extends Component {
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this._removePreviousState();
    this.props.reset(); // Remove previously set state of previous screen on back navigation.
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: this.props.currentCategory ? this.props.currentCategory.name : 'Performance Review',
        image: this.props.selectedEmployeeInfo.avatar }));
    ActionBarModule.toggleBackButton(true);
  }

  _removePreviousState = () => {
    let reviewCategoryItems = this.props.reviewCategoryItems.slice(0);
    if (reviewCategoryItems.length === 0) {
      this.props.resetFilterCategories([]);
    } else {
      let length = reviewCategoryItems.length;
      let categoryItems = reviewCategoryItems;
      categoryItems.pop();
      this.props.resetCategoryItems(categoryItems)

      let filterCategories = this.props.filterCategories.slice(0);
      let newFilterCategories = filterCategories.map((filterCategory, index) => {
        if (index === length - 1) {
          delete filterCategory["items"]
        }
        return filterCategory;
      })
      this.props.resetFilterCategories(newFilterCategories);
    }
  }

  getImageUri = src => {
    if (Platform.OS === 'android') {
      return { uri: `asset:/${src}` };
    }

    return { uri: src };
  };

  onButtonPress = (category, avatar) => {
    Actions[getReviewNextAction(category.nextActionPage)]({ category });
    // Actions["reviewSwiper"]({ category });
    ActionBarModule.updateTitleAndMenu(JSON.stringify({ title: category.name, image: avatar }));
    ActionBarModule.toggleBackButton(true);
  };

  render() {
    const item = this.props;
    return (

      <View style={styles.container}>
        <FadeInView delay={1000} from={20} duration={3000} toValue={3000} style={styles.topContainer}>
          <View style={styles.topTextContainer}>
            <Text style={styles.topText}>{item.category.name || 'Category Title'}</Text>
            <Text style={styles.topText}>
              {item.category.description || ``}
            </Text>
          </View>

          <View style={styles.imageContainer}>
            <Image
              resizeMethod="resize"
              style={styles.image}
              source={this.getImageUri('people.png')}
            />
          </View>
        </FadeInView>
        <FadeInView delay={2000} from={0} duration={3000} toValue={3000} style={styles.middleContainer}>
          <View style={styles.upperMiddleContainer}>
            <View style={styles.topTextContainer}>
              <Text style={styles.middleText}>
                Next, select <Text style={styles.lightText}>{` ${this.props.maxCompetencyCount} attributes`}</Text>
                {` to describe  ${item.selectedEmployeeInfo.first_name}`}
              </Text>
            </View>
            <View style={styles.imageContainer}>
              <Image resizeMethod="resize" style={styles.image} source={{ uri: item.selectedEmployeeInfo.avatar }} />
            </View>
          </View>
        </FadeInView>
        <FadeInView delay={2900} from={0} duration={3000} toValue={3000} style={styles.bottomContainer}>
          <TouchableOpacity onPress={() => this.onButtonPress(item.category, item.selectedEmployeeInfo.avatar)}>
            <View style={styles.buttonContainer}>
              <Image style={{ width: 12, height: 22 }} source={this.getImageUri('arrowRightWhite.png')} />
            </View>
          </TouchableOpacity>
        </FadeInView>
      </View>
    )
  }
}

export default AttributeSelection;
