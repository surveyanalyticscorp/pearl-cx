import React, { Component } from 'react';
import {
  View,
  Text,
  TouchableHighlight
} from 'react-native';

import styles from './style';
import { getColor } from '../../../utils/levelColors';


export default class ReviewInfiniteScrollWordItem extends Component {

  constructor(props) {
    super(props);
    this.state = {
      width: 0
    };
  }

  getTextColor(color) {
    return { color };
  }

  getBorderColor(color) {
    return { borderColor: color };
  }

  _getTextDimension = ({ width }) => {
    this.setState({ width });
  };

  checkSelectedItem(item, selected) {
    if (selected) {
      return { backgroundColor: getColor(item.rating) };
    }

    return null;
  }

  hasSelectedItem(items, id) {
    let hasSelected = false;

    if (items.length > 0) {
      const selectedItem = items.filter((item) => item.id === id);
      if (selectedItem.length > 0) hasSelected = true;
    }

    return hasSelected;
  }

  _onPress = () => {
    const item = Object.assign(this.props.item, {
      boxNumber: this.props.rating
    });
    this.props.onPress(item);
  }

  render() {
    const selectedItem = this.hasSelectedItem(this.props.selectedItems, this.props.item.id);
    const textColor = selectedItem ? '#FFFFFF' : this.props.color;

    return (
      <TouchableHighlight
        disabled={this.props.disabled}
        style={[styles.cell, this.getBorderColor(this.props.color), this.checkSelectedItem(this.props.item, selectedItem)]}
        underlayColor='rgba(255, 255, 255, 1)'
        onPress={this._onPress}
      >
        <View>
          <Text
            onLayout={this._getTextDimension}
            style={[styles.text, this.getTextColor(textColor)]}
          >
            {this.props.item.name}
          </Text>
        </View>
      </TouchableHighlight>
    );
  }

}
