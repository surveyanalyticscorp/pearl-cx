import React, { Component } from 'react';
import { View, ScrollView } from 'react-native';

import styles from './wordStyle';
import Word from './Word';
import { getColor } from '../../utils/levelColors';

class WordCloud extends Component {
  constructor(props) {
    super(props);

    this.state = {
      hideOverlay: false
    };
  }

  render() {
    return (
      <View style={[styles.container, this.props.containerStyle]}>
        <ScrollView
          scrollEventThrottle={100}
          scrollEnabled={this.props.scrollEnabled}
          contentContainerStyle={this.props.contentContainerStyle}
          onScroll={({ nativeEvent }) =>
            this.setState({ hideOverlay: this._isCloseToBottom(nativeEvent) })
          }
        >
          <View style={styles.viewContainer}>
            {this.props.reviewItems &&
              this.props.reviewItems.map((item, index) => (
                <Word
                  key={index}
                  text={item.name}
                  cellStyle={this._getCellStyle(item)}
                  disabled={this.props.selectedItems.length >= this.props.maxCompetencyCount}
                  ref={node => (this['wordItem_' + index] = node)}
                  onPress={() => this.props.onWordItemPress(item, index)}
                />
              ))}
          </View>
          {this.props.children}
        </ScrollView>

        {!this.state.hideOverlay ? (
          <View style={styles.bottomContainerLight} />
        ) : null}
        {!this.state.hideOverlay ? (
          <View style={styles.bottomContainerDark} />
        ) : null}
        <View style={styles.bottomContainerFixed} />
      </View>
    );
  }

  _getCellStyle = item => {
    let style = {
      borderWidth: 1,
      borderBottomWidth: 3,
      borderColor: 'transparent'
    };

    let selectedItem = this.props.selectedItems.find(
      selectedItem => selectedItem.id === item.id
    );
    if (selectedItem) {
      let color = getColor(selectedItem.boxNumber);

      style = { ...style, borderColor: color };
    }

    return style;
  };

  _isCloseToBottom = ({ layoutMeasurement, contentOffset, contentSize }) => {
    const paddingToBottom = 30;

    return (
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom
    );
  };
}

export default WordCloud;
