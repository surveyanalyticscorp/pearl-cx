import React, { Component } from 'react';
import { View, ScrollView, ActivityIndicator } from 'react-native';
import {
    DotIndicator
} from 'react-native-indicators';
import * as _ from 'lodash';
import { Draggable, DropZone } from '../../dragndrop';

import styles from './style';
import WordItem from './WordItem';
import ReviewDragHolder from './ReviewDragHolder';


class ReviewDragItems extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dragOn: 'onPressIn',
      wordCloudBoxWidth: null,
      wordCloudBoxHeight: null
    };
  }

  _getContentsize(contentWidth, contentHeight) {
    this.setState({
      wordCloudBoxWidth: contentWidth,
      wordCloudBoxHeight: contentHeight
    });
  }

  hasDroppedItem(allBoxItems, row) {
    return allBoxItems.length > 0 && _.find(allBoxItems, item => item.id === row.id);
  }

  loading() {
      return <DotIndicator style={styles.loading} color="rgb(37, 137, 228)" count={3} size={10}/>;
  }

  render() {
    const { reviewItems, allBoxItems, dragging, loadMoreItems } = this.props;
    const disabled = allBoxItems.length >= this.props.maxCompetencyCount;
    const dragOn = this.state.dragOn;

    return (
      <View style={styles.container}>
        <ScrollView
          onContentSizeChange={this._getContentsize.bind(this)}
          scrollEventThrottle={100}
          onScroll={({ nativeEvent }) => this.props.onScrollItems(nativeEvent)}
          scrollEnabled={!dragging}
        >
          <View style={styles.item}>
            {reviewItems.map(item => {
              const isItemSelected = this.hasDroppedItem(allBoxItems, item);
              return (
                <Draggable
                  dragOn={dragOn}
                  disabled={isItemSelected || allBoxItems.length >= this.props.maxCompetencyCount}
                  key={item.id}
                  data={item}
                  style={{ margin: 5 }}
                >
                  <ReviewDragHolder id={item.id}>
                    <WordItem
                      id={item.id}
                      text={item.name}
                      style={isItemSelected ? styles.titleTxtSelected : styles.titleTxt}
                    />
                  </ReviewDragHolder>
                </Draggable>
              );
            })}
            <View
              style={
                disabled || dragging
                  ? [
                      styles.dragItemsOverlay,
                      {
                        width: this.state.wordCloudBoxWidth,
                        height: this.state.wordCloudBoxHeight
                      }
                    ]
                  : null
              }
            />
          </View>
          {loadMoreItems && <View style={styles.loadMoreItems}>{this.loading()}</View>}
        </ScrollView>
        {!this.props.hideOverlay ? <View style={styles.bottomContainerLight} /> : null}
        {!this.props.hideOverlay ? <View style={styles.bottomContainerDark} /> : null}
      </View>
    );
  }
}

export default ReviewDragItems;
