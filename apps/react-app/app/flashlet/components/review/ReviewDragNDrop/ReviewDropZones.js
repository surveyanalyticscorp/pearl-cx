import React, { Component } from 'react';
import { Text, View, Animated, Easing } from 'react-native';
import * as _ from 'lodash';
import { connect } from 'react-redux';
import { DropZone } from '../../dragndrop';

import styles from './style';
import ReviewDropBox from './ReviewDropBox';
import { getColor } from '../../../utils/levelColors';

const reviewDropZones = [4, 3, 2, 1];

class ReviewDropZones extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selected: null,
      boxItemList: [],
      selectedItems: [],
      activeBoxHover: '',
      hasOpenSidebar: false,
      animWidth: new Animated.Value(10)
    };

    this._animWidth = new Animated.Value(0);
  }

  componentWillUnmount() {
    if (this.zoneEnterTimeout) clearTimeout(this.zoneEnterTimeout);
  }

  componentWillReceiveProps(props) {
    if (props.dragging && !this.state.hasOpenSidebar) {
      this.setState({ hasOpenSidebar: true });
      this.setState(
        {
          animWidth: this._animWidth.interpolate({
            inputRange: [0, 1],
            outputRange: [0, props.dropZoneBoxWidth]
          })
        },
        () => {
          Animated.timing(this._animWidth, {
            toValue: 1,
            duration: 100,
            easing: Easing.easeInOutQuad
          }).start();
        }
      );
    }

    if (!props.dragging && props.reset) {
      this.setState({ boxItemList: [] });
    }
  }

  _onDropBoxItem(boxNumber, item) {
    let selectedItem = Object.assign({}, item, {
      boxNumber
    });
    this.state.boxItemList.push(selectedItem);
    this.setState({ recentDropItem: selectedItem.id }, () => {
      this.props.onDropReviewItem(this.allBoxesItems());
    });
  }

  _onEnterDropZone(boxNumber) {
    if (this.zoneEnterTimeout) clearTimeout(this.zoneEnterTimeout);

    this.zoneEnterTimeout = setTimeout(() => {
      this.setState({ activeBoxHover: boxNumber });
    }, 1);
  }

  _onLeaveDropZone(boxNumber) {
    this.setState({ activeBoxHover: '' });
  }

  setSelectedItems = () => {
    setTimeout(() => {
      const allItems = this.allBoxesItems();
      this.setState({ selectedItems: allItems });
    }, 0);
  };

  allBoxesItems() {
    return _.uniqBy(this.state.boxItemList, 'id');
  }

  getBoxBgColor = boxNumber => {
    let background;
    const boxBgColor = getColor(boxNumber);

    switch (boxNumber) {
      case 1:
        background = {
          boxColor: { backgroundColor: boxBgColor },
          boxHoverColor: { backgroundColor: 'rgba(196,52, 52, 0.3)' }
        };
        break;
      case 2:
        background = {
          boxColor: { backgroundColor: boxBgColor },
          boxHoverColor: { backgroundColor: 'rgba(248, 183, 89, 0.3)' }
        };
        break;
      case 3:
        background = {
          boxColor: { backgroundColor: boxBgColor },
          boxHoverColor: { backgroundColor: 'rgba(152, 219, 77, 0.3)' }
        };
        break;
      case 4:
        background = {
          boxColor: { backgroundColor: boxBgColor },
          boxHoverColor: { backgroundColor: 'rgba(105, 145, 56, 0.3)' }
        };
        break;
      default:
    }

    return background;
  };

  _getBoxItems(boxNumber) {
    let boxItems = [];
    if (this.state.boxItemList.length > 0) {
      boxItems = this.state.boxItemList.filter(
        item => item.boxNumber === boxNumber
      );
    }

    return boxItems;
  }

  render() {
    const {
      dropZoneBoxWidth,
      dropZoneContentHeight,
      hasOpenSidebar
    } = this.props;
    const allBoxesItems = this.allBoxesItems();
    const disabled = allBoxesItems.length >= this.props.maxCompetencyCount;
    const activeBoxHover = this.state.activeBoxHover;
    const dropZoneArr = [];

    reviewDropZones.forEach(zone => {
      const color = this.getBoxBgColor(zone);
      dropZoneArr.push(
        <DropZone
          key={`dropzone-${zone}`}
          disabled={disabled}
          onEnter={() => this._onEnterDropZone(zone)}
          onLeave={() => this._onLeaveDropZone(zone)}
          onDrop={item => {
            this._onDropBoxItem(zone, item);
          }}
        >
          <ReviewDropBox
            key={`reviewdropbox-${zone}`}
            customStyle={
              activeBoxHover === zone
                ? [styles.boxHoverLayout, color.boxHoverColor]
                : [styles.boxLayout, color.boxColor]
            }
            id={zone}
            animateWidth={this.state.animWidth}
            items={this._getBoxItems(zone)}
            hasOpenSidebar={this.state.hasOpenSidebar}
            boxWidth={dropZoneBoxWidth}
            boxHeight={dropZoneContentHeight / 4}
          />
        </DropZone>
      );
    });

    return (
      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'flex-end',
          flexDirection: 'column'
        }}
      >
        <View style={[styles.dropZoneTop, { width: dropZoneBoxWidth }]}>
          {hasOpenSidebar && <Text style={styles.dropZoneTopTxt}>Always</Text>}
        </View>
        <View style={styles.dropZoneBoxes}>{dropZoneArr}</View>
        <View style={[styles.dropZoneBottom, { width: dropZoneBoxWidth }]}>
          {hasOpenSidebar && (
            <Text style={styles.dropZoneBottomTxt}>Rarely</Text>
          )}
        </View>
      </View>
    );
  }
}

export default connect()(ReviewDropZones);
