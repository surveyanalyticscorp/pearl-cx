import React, { Component } from 'react';
import { View } from 'react-native';
import * as _ from 'lodash';

const styles = require('./style');

let dragWordList = [];

export default class ReviewDragHolder extends Component {
  /**
   *
   * @param {*} id
   * return Object
   */
  _getWidth(id) {
    let width = 100;
    const matchedRow = _.find(dragWordList, word => word.id === id);
    if (matchedRow) width = matchedRow.width;

    return { width };
  }

  /**
   *
   * @param {*} nativeEvent
   * @param {*} id
   * return Void
   */
  _nativeEvent(nativeEvent, id) {
    const matchedRow = _.find(dragWordList, word => word.id === id);
    if (!matchedRow) {
      dragWordList.push({ id, width: nativeEvent.layout.width });
    }
  }

  render() {
    if (this.props.dragOver && !this.props.ghost && !this.props.dragging) {
      return <View style={styles.dragOnHold} />;
    }

    return (
      <View
        //key={this.props.id}
        onLayout={({ nativeEvent }) => this._nativeEvent(nativeEvent, this.props.id)}
        style={[
          styles.dragOnReady,
          { backgroundColor: this.props.ghost ? '#fff' : '#fff' },
          this.props.dragging ? [styles.dragShadow, this._getWidth(this.props.id)] : null
        ]}
      >
        {this.props.children}
      </View>
    );
  }
}
